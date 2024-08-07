import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsIP, IsNotEmpty, IsString } from 'class-validator';
import { TFASecretDto, UserAccountDto } from '@app/common/dto/user-account.dto';

export class LoginRequest {
  @ApiProperty({
    type: String,
    example: 'john',
    description: 'Username of the user attempting to login',
  })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({
    type: String,
    example: '123',
    description: 'Password of the user attempting to login',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class LoginMsgRequest extends LoginRequest {
  @ApiProperty({
    type: String,
    description: "Source of the login attempt, the user's header 'User-Agent' string",
    example:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
  })
  @IsString()
  @IsNotEmpty()
  source!: string;

  @ApiProperty({
    type: String,
    description: 'IP address of the user',
    examples: [
      {
        value: '192.168.1.1',
        description: 'An example of an IPv4 address',
      },
      {
        value: '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
        description: 'An example of an IPv6 address',
      },
    ],
  })
  @IsString()
  @IsNotEmpty()
  @IsIP()
  ipAddress!: string;
}

export class LoginResponse {
  @ApiProperty({
    type: String,
    description: 'JWT access token for user',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJKb2huIERvZSIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  accessToken?: string;

  @ApiProperty({
    type: String,
    description: 'TFA verification token for user. Either accessToken or tfaVerificationToken must be present',
    example: '50b93e41-2335-402a-a077-e1b6af68cd58',
  })
  tfaVerificationToken?: string;

  @ApiProperty({
    type: Boolean,
    description: 'Flag indicating if TFA is required for user',
    example: true,
  })
  tfaRequired!: boolean;
}

export class LoginAttemptPayload {
  user!: UserAccountDto;

  loginRequest!: LoginMsgRequest;

  requestedTFA!: TFASecretDto;
}

export class LoginAttemptRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userAccount!: string;

  @ApiProperty()
  @IsNotEmpty()
  // @IsDate() TBD: or date validation
  @IsString()
  attemptTime!: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isSuccess!: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  attemptLocation!: string;
}

export class LoginAttemptResponse {
  @ApiProperty()
  success!: boolean;
}
