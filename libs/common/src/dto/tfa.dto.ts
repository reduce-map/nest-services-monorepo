import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class TFARequest {
  @ApiProperty({
    type: String,
    example: '50b93e41-2335-402a-a077-e1b6af68cd58',
    description: 'TFA verification token for user',
  })
  @IsUUID()
  tfaVerificationToken!: string;

  @ApiProperty({
    type: String,
    example: '123456',
    description: 'TFA code for user',
  })
  @IsString()
  @IsNotEmpty()
  code!: string;
}

export class TFAResponse {
  @ApiProperty({
    type: String,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJKb2huIERvZSIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    description: 'JWT access token for user',
  })
  accessToken!: string;
}
