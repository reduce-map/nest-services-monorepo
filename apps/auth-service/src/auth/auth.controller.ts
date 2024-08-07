import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  RoutingKeys,
  LoginMsgRequest,
  LogoutRequest,
  TFARequest,
  TFAResponse,
  ValidateJwtTokenMsgRequest,
  ValidateJwtTokenMsgResponse,
  JwtTokenInvalidError,
  LogoutResponse,
  LoginResponse,
} from '@app/common';
import { AsyncApiPub, AsyncApiSub } from 'nestjs-asyncapi';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AsyncApiPub({
    channel: RoutingKeys.Login,
    message: {
      payload: LoginMsgRequest,
    },
  })
  @AsyncApiSub({
    channel: RoutingKeys.Login,
    message: {
      payload: LoginResponse,
    },
  })
  @MessagePattern({ cmd: RoutingKeys.Login })
  public async login(loginDto: LoginMsgRequest): Promise<LoginResponse> {
    // this.logger?.info(
    //   `User ${loginDto.username} is attempting to log in with ip ${loginDto.ipAddress} and source ${loginDto.source}`,
    // );
    const loginResult = await this.authService.login(loginDto);
    return loginResult;
  }

  @AsyncApiPub({
    channel: RoutingKeys.SubmitTFA,
    message: {
      payload: TFARequest,
    },
  })
  @AsyncApiSub({
    channel: RoutingKeys.SubmitTFA,
    message: {
      payload: TFAResponse,
    },
  })
  @MessagePattern({ cmd: RoutingKeys.SubmitTFA })
  public async submitTFA(tfaDto: TFARequest): Promise<TFAResponse> {
    // this.logger?.info(
    //   `User with tfa verification token ${tfaDto.tfaVerificationToken} is submitting TFA code ${tfaDto.code}`,
    // );
    return await this.authService.submitTFACode(tfaDto);
  }

  @AsyncApiPub({
    channel: RoutingKeys.ValidateJwt,
    message: {
      payload: ValidateJwtTokenMsgRequest,
    },
  })
  @AsyncApiSub({
    channel: RoutingKeys.ValidateJwt,
    message: {
      payload: ValidateJwtTokenMsgResponse,
    },
  })
  @MessagePattern({ cmd: RoutingKeys.ValidateJwt })
  public async validateJwt(jwtDto: ValidateJwtTokenMsgRequest): Promise<ValidateJwtTokenMsgResponse> {
    const isValid = await this.authService.isJwtValid(jwtDto.token);
    return { isValid };
  }

  @AsyncApiPub({
    channel: RoutingKeys.Logout,
    message: {
      payload: LogoutRequest,
    },
  })
  @AsyncApiSub({
    channel: RoutingKeys.Logout,
    message: {
      payload: LogoutResponse,
    },
  })
  @MessagePattern({ cmd: RoutingKeys.Logout })
  public async logout(logoutDto: LogoutRequest): Promise<LogoutResponse> {
    const jwtPayload = this.authService.getJwtPayload(logoutDto.token);
    if (!jwtPayload) throw new JwtTokenInvalidError();
    // this.logger?.info(`User ${jwtPayload.username} is logging out`);
    await this.authService.logout(logoutDto.token);
    return { success: true };
  }
}
