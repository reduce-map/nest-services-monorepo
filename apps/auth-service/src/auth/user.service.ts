import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  DITokenNames,
  getLocationByIp,
  RoutingKeys,
  RoutingKeysEntities,
  UserAccountDto,
  UserSessionDto,
  TFASecretDto,
  LoginAttemptRequest,
} from '@app/common';
import { ConfigPropertyNames } from '../config-auth-service.module';

@Injectable()
export class UserService {
  constructor(
    @Inject(DITokenNames.ACCOUNT_USER_SERVICE) private readonly accountUserMicroserviceClient: ClientProxy,
    @Inject(DITokenNames.LOGIN_ATTEMPTS_SERVICE) private readonly loginAttemptsMicroserviceClient: ClientProxy,
    private readonly configService: ConfigService,
  ) {}

  getUserById(id: string): Promise<UserAccountDto | null> {
    return firstValueFrom(
      this.accountUserMicroserviceClient.send(
        { cmd: RoutingKeys.Find, entity: RoutingKeysEntities.UserAccount },
        { _id: id },
      ),
    );
  }

  getUserByUsername(username: string): Promise<UserAccountDto | null> {
    return firstValueFrom(
      this.accountUserMicroserviceClient.send(
        { cmd: RoutingKeys.Find, entity: RoutingKeysEntities.UserAccount },
        // { 'credentials.login': username },
        { credentials: { login: username } },
      ),
    );
  }

  saveUserSession(id: string, session: UserSessionDto) {
    return firstValueFrom(
      this.accountUserMicroserviceClient.send(
        { cmd: RoutingKeys.Update, entity: RoutingKeysEntities.UserAccount },
        {
          _id: id,
          $push: { sessions: session },
        },
      ),
    );
  }

  saveUserLoginAttempt(loginAttempt: LoginAttemptRequest) {
    return firstValueFrom(
      this.loginAttemptsMicroserviceClient.send(
        { cmd: RoutingKeys.Create, entity: RoutingKeysEntities.LoginAttempt },
        loginAttempt,
      ),
    );
  }

  removeUserSession(userId: string, token: string) {
    return firstValueFrom(
      this.accountUserMicroserviceClient.send(
        { cmd: RoutingKeys.Update, entity: RoutingKeysEntities.UserAccount },
        {
          _id: userId,
          $pull: { sessions: { token } },
        },
      ),
    );
  }

  saveLoginAttempt(user: UserAccountDto, ipAddress: string, success: boolean) {
    const loginAttempt: LoginAttemptRequest = {
      userAccount: user._id,
      attemptTime: new Date(),
      isSuccess: success,
      address: ipAddress,
      attemptLocation: getLocationByIp(ipAddress),
    };

    return this.saveUserLoginAttempt(loginAttempt);
  }

  saveSession(user: UserAccountDto, token: string, ipAddress: string, userAgent: string) {
    const location = getLocationByIp(ipAddress);
    const jwtExpirationTime = this.configService.getOrThrow(ConfigPropertyNames.JWT_EXPIRATION_SEC) * 1000;
    const session: UserSessionDto = {
      source: userAgent,
      location,
      address: ipAddress,
      connectedAt: new Date(),
      expires: new Date(Date.now() + jwtExpirationTime),
      token,
    };

    return this.saveUserSession(user._id, session);
  }

  public getRequiredTFA(user: UserAccountDto): TFASecretDto | undefined {
    return user.twoFAsecrets.find((tfa: TFASecretDto) => tfa.isEnabled);
  }
}
