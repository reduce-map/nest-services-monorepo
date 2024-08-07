import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  LoggerService,
  RoutingKeys,
  RoutingKeysEntities,
  LoginAttemptResponse,
  LoginAttemptRequest,
} from '@app/common';
import { LoginAttemptsService } from './login-attempts.service';
import { ApiTags } from '@nestjs/swagger';
import { AsyncApiPub, AsyncApiSub } from 'nestjs-asyncapi';

@ApiTags('login-attempts')
@Controller('login-attempts')
export class LoginAttemptsController {
  constructor(
    private readonly logger: LoggerService,
    private readonly loginAttemptsService: LoginAttemptsService,
  ) {}

  @AsyncApiSub({
    channel: `${RoutingKeys.Create}${RoutingKeysEntities.LoginAttempt}`,
    message: {
      payload: LoginAttemptRequest,
    },
  })
  @AsyncApiPub({
    channel: `${RoutingKeys.Create}${RoutingKeysEntities.LoginAttempt}`,
    message: {
      payload: LoginAttemptResponse,
    },
  })
  @MessagePattern({ cmd: RoutingKeys.Create, entity: RoutingKeysEntities.LoginAttempt })
  async createLoginAttempt(loginAttempt: LoginAttemptRequest): Promise<LoginAttemptResponse> {
    this.logger?.info(`Create login attempt with data ${Object.values(loginAttempt).join(';')}`);
    await this.loginAttemptsService.createLoginAttempt(loginAttempt);
    return {
      success: true,
    };
  }
}
