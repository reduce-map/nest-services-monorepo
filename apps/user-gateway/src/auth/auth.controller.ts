import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import {
  // LoggerService,
  LoginRequest,
  LoginResponse,
  TFARequest,
  TFAResponse,
  LogoutRequest,
  LogoutResponse,
} from '@app/common';
import {
  ApiOkResponse,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('User Authentication')
@Controller()
export class AuthController {
  constructor(
    // private readonly logger: LoggerService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user with username and password' })
  @ApiBody({
    type: LoginRequest,
  })
  @ApiOkResponse({
    description: 'User successfully logged in, but TFA is required',
    type: LoginResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid username or password',
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many login attempts. Try again after',
  })
  @ApiInternalServerErrorResponse({
    description: 'Unexpected login RPC request validation error',
  })
  @HttpCode(HttpStatus.OK)
  async login(@Req() request: Request, @Body() userLoginData: LoginRequest): Promise<LoginResponse> {
    const ipAddress = request.ip!;
    const source = request.get('User-Agent') ?? 'Unknown';
    // this.logger?.info(
    //   `User ${userLoginData.username} is attempting to log in with ip ${ipAddress} and source ${source}`,
    // );
    return await this.authService.login(userLoginData, ipAddress, source);
  }

  @Post('submit-tfa')
  @ApiOperation({ summary: 'Submit TFA code' })
  @ApiBody({
    type: TFARequest,
  })
  @ApiOkResponse({
    description: 'User successfully logged in with TFA code',
    type: TFAResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid TFA code',
  })
  @ApiForbiddenResponse({
    description: 'Invalid TFA verification token',
  })
  @ApiInternalServerErrorResponse({
    description: 'Unexpected submit TFA RPC request validation error',
  })
  @HttpCode(HttpStatus.OK)
  async submitTFA(@Body() submitTFAData: TFARequest): Promise<TFAResponse> {
    // this.logger.info(
    //   `User with tfa verification token ${submitTFAData.tfaVerificationToken} is submitting TFA code ${submitTFAData.code}`,
    // );
    return await this.authService.submitTFACode(submitTFAData);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user with token' })
  @ApiBody({
    type: LogoutRequest,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid token',
  })
  @ApiOkResponse({
    description: 'User successfully logged out',
    type: LogoutResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'Unexpected logout RPC request validation error',
  })
  @HttpCode(HttpStatus.OK)
  async logout(@Body() logoutData: LogoutRequest) {
    await this.authService.logout(logoutData.token);
    // this.logger.info(`User with token ****${logoutData.token.substring(logoutData.token.length - 5)} is logging out`);
    return 'User successfully logged out';
  }
}
