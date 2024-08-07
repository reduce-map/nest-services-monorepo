import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty } from 'class-validator';

export class ValidateJwtTokenMsgRequest {
  @ApiProperty({
    type: String,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJKb2huIERvZSIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    description: 'JWT token to validate',
  })
  @IsJWT()
  @IsNotEmpty()
  token!: string;
}

export class JwtPayloadDto {
  @ApiProperty()
  userId!: string;

  @ApiProperty()
  username!: string;
}

export class ValidateJwtTokenMsgResponse {
  @ApiProperty()
  isValid!: boolean;
}
