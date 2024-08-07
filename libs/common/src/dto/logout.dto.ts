import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty } from 'class-validator';

export class LogoutRequest {
  @ApiProperty({
    type: String,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJKb2huIERvZSIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    description: 'JWT token of the user to log out',
  })
  @IsJWT()
  @IsNotEmpty()
  token!: string;
}

export class LogoutResponse {
  @ApiProperty({
    type: Boolean,
    description: 'Flag indicating if user was successfully logged out',
    example: true,
  })
  success!: boolean;
}
