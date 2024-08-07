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

  //   async checkLoginAttempts(user: UserAccount) {
  //     // developing in progress
  //     const maxAttempts = this.configService.getOrThrow<number>(ConfigPropertyNames.MAX_LOGIN_ATTEMPTS);

  //     const lockoutTime = this.configService.getOrThrow<number>(ConfigPropertyNames.LOGIN_LOCKOUT_TIME_MIN) * 60 * 1000;
  //     // receive all attempts in the last checkWindow, sort them by time, and count all unsuccessful after the last successful

  //     const attempts = (
  //       await this.loginAttemptRepository.findMany({
  //         userAccount: user._id,
  //         attemptTime: { $gt: new Date(Date.now() - lockoutTime) },
  //       })
  //     ) // get all attempts in the window of lockout time
  //       .sort((a, b) => b.attemptTime.getTime() - a.attemptTime.getTime()); // sort by time descending, so that the newest attempts come first
  //     if (attempts.length === 0) return;
  //     const firstSuccessfulAttempt = attempts.findIndex((a) => a.isSuccess); // get the index of the last successful attempt
  //     if (firstSuccessfulAttempt !== -1) attempts.splice(0, firstSuccessfulAttempt); // remove all attempts before the last successful, because they are irrelevant

  //     if (attempts.length >= maxAttempts)
  //       // if there are more than maxAttempts, check if the last attempt is older than lockoutTime
  //       throw new TooManyLoginAttemptsError({
  //         tryAgainAfterMs: lockoutTime - (Date.now() - attempts[0].attemptTime.getTime()),
  //       });
  //   }
}
