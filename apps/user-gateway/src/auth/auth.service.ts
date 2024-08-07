import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  // LoggerService,
  DITokenNames,
  RoutingKeys,
  IncorrectTFACodeError,
  IncorrectTfaVerificationTokenError,
  RpcValidationError,
  TooManyLoginAttemptsError,
  UserNotFoundError,
  JwtTokenInvalidError,
  LoginMsgRequest,
  LogoutRequest,
  LoginResponse,
  LoginRequest,
  TFAResponse,
  TFARequest,
} from '@app/common';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DITokenNames.AUTHENTICATION_SERVICE)
    private readonly authMicroserviceClient: ClientProxy,
    // private readonly logger: LoggerService,
  ) {}

  async login(httpLoginRequestDto: LoginRequest, ipAddress: string, source: string): Promise<LoginResponse> {
    try {
      const loginRequestDto: LoginMsgRequest = {
        username: httpLoginRequestDto.username,
        password: httpLoginRequestDto.password,
        source: source,
        ipAddress: ipAddress,
      };
      const loginResponse: LoginResponse = await firstValueFrom(
        this.authMicroserviceClient.send({ cmd: RoutingKeys.Login }, loginRequestDto),
      );
      return loginResponse;
    } catch (error: any) {
      switch (error.constructor) {
        case UserNotFoundError:
          throw new UnauthorizedException('Invalid username or password');
        case TooManyLoginAttemptsError:
          const tooManyError = error as TooManyLoginAttemptsError;
          throw new HttpException(
            `Too many login attempts. Try again after ${tooManyError.details.tryAgainAfterMs} seconds`,
            HttpStatus.TOO_MANY_REQUESTS,
          );
        case RpcValidationError:
          // const validError = error as RpcValidationError;
          // this.logger.error(
          //   'Unexpected login RPC request validation error: ' + JSON.stringify(validError.validationErrors),
          // );
          throw new InternalServerErrorException();
      }
      throw error;
    }
  }

  async submitTFACode(submitTFADto: TFARequest): Promise<TFAResponse> {
    try {
      const submitRequest: TFARequest = {
        tfaVerificationToken: submitTFADto.tfaVerificationToken,
        code: submitTFADto.code,
      };
      const submitTFAResponse: TFAResponse = await firstValueFrom(
        this.authMicroserviceClient.send({ cmd: RoutingKeys.SubmitTFA }, submitRequest),
      );
      return submitTFAResponse;
    } catch (error: any) {
      switch (error.constructor) {
        case IncorrectTfaVerificationTokenError:
          throw new ForbiddenException('Invalid TFA verification token');
        case IncorrectTFACodeError:
          throw new UnauthorizedException('Invalid TFA code');
        case RpcValidationError:
          // const validError = error as RpcValidationError;
          // this.logger.error(
          //   'Unexpected submit TFA RPC request validation error: ' + JSON.stringify(validError.validationErrors),
          // );
          throw new InternalServerErrorException();
      }
      throw error;
    }
  }

  async logout(accessToken: string): Promise<void> {
    try {
      const request: LogoutRequest = { token: accessToken };
      await firstValueFrom(this.authMicroserviceClient.send({ cmd: RoutingKeys.Logout }, request));
    } catch (error: any) {
      switch (error.constructor) {
        case RpcValidationError:
          // const validError = error as RpcValidationError;
          // this.logger.error(
          //   'Unexpected logout RPC request validation error: ' + JSON.stringify(validError.validationErrors),
          // );
          throw new InternalServerErrorException();
        case JwtTokenInvalidError:
          throw new UnauthorizedException('Invalid token');
      }
      throw error;
    }
  }
}
