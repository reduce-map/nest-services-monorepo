import { Injectable } from '@nestjs/common';
import {
  IncorrectTFACodeError,
  IncorrectTfaVerificationTokenError,
  MicroserviceError,
  UserNotFoundError,
  generateUUID,
  JwtPayloadDto,
  LoginMsgRequest,
  LoginResponse,
  TFARequest,
  TFAResponse,
  JwtTokenInvalidError,
  TFASecretSource,
  UserAccountDto,
  LoginAttemptPayload,
  UserSessionDto,
} from '@app/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  private readonly tfaVerifications: Map<string, LoginAttemptPayload> = new Map();
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {
    this.tfaVerifications = new Map(); // assumption
  }

  async login(loginDto: LoginMsgRequest): Promise<LoginResponse> {
    const user = await this.userService.getUserByUsername(loginDto.username);
    let loginSuccess = false;
    try {
      if (!user) throw new UserNotFoundError();
      const dbPasswordHash = user.credentials.password;
      if (!bcrypt.compareSync(loginDto.password, dbPasswordHash)) throw new UserNotFoundError();
      const requiredTFA = this.userService.getRequiredTFA(user);
      if (!requiredTFA) {
        const accessToken = await this.createSession(user, loginDto.ipAddress, loginDto.source);
        loginSuccess = true;
        return { accessToken, tfaRequired: false };
      }
      const tfaVerificationToken = generateUUID();
      this.tfaVerifications.set(tfaVerificationToken, { user, loginRequest: loginDto, requestedTFA: requiredTFA });
      loginSuccess = true;
      return { tfaRequired: true, tfaVerificationToken };
    } finally {
      if (user) await this.userService.saveLoginAttempt(user, loginDto.ipAddress, loginSuccess);
    }
  }

  async submitTFACode(submitTFADto: TFARequest): Promise<TFAResponse> {
    const loginAttempt = this.tfaVerifications.get(submitTFADto.tfaVerificationToken);
    if (!loginAttempt) throw new IncorrectTfaVerificationTokenError();
    if (loginAttempt.requestedTFA.source != TFASecretSource.TOTP)
      throw new MicroserviceError('Only TOTP TFA is supported currently');
    if (!this.verifyTOTPCode(loginAttempt.requestedTFA.secret, submitTFADto.code))
      throw new IncorrectTFACodeError({ source: TFASecretSource.TOTP });
    const accessToken = await this.createSession(
      loginAttempt.user,
      loginAttempt.loginRequest.ipAddress,
      loginAttempt.loginRequest.source,
    );
    this.tfaVerifications.delete(submitTFADto.tfaVerificationToken);
    return { accessToken };
  }

  async logout(token: string): Promise<void> {
    const jwtPayload = this.getJwtPayload(token);
    if (!jwtPayload) throw new JwtTokenInvalidError();
    const user = await this.userService.getUserById(jwtPayload.userId);
    if (!user) throw new UserNotFoundError();
    await this.userService.removeUserSession(user._id.toString(), token);
  }

  async isJwtValid(token: string): Promise<boolean> {
    try {
      const jwtPayload = this.jwtService.verify(token) as JwtPayloadDto;
      const user = await this.userService.getUserById(jwtPayload.userId);
      if (!user) return false;
      const session = user.sessions.find((s: UserSessionDto) => s.token === token);
      if (!session) return false;
      return new Date(session.expires) > new Date();
    } catch (error) {
      return false;
    }
  }

  private async createSession(user: UserAccountDto, ipAddress: string, source: string): Promise<string> {
    const jwtPayload: JwtPayloadDto = {
      userId: user._id.toString(),
      username: user.credentials.login,
    };
    const accessToken = await this.jwtService.signAsync(jwtPayload);
    await this.userService.saveSession(user, accessToken, ipAddress, source);
    return accessToken;
  }

  /**
   * Returns the payload of a JWT token, if the token is valid
   * And undefined if the token is invalid
   * @param token
   * @returns
   */
  getJwtPayload(token: string): JwtPayloadDto | undefined {
    try {
      return this.jwtService.verify(token) as JwtPayloadDto;
    } catch (error) {
      return undefined;
    }
  }

  private verifyTOTPCode(secret: string, code: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: code,
    });
  }
}
