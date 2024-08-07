import { IsNotEmpty, IsString, IsBoolean, IsDate, IsEnum } from 'class-validator';
import { ApiProperty, PartialType, IntersectionType } from '@nestjs/swagger';
import { TFASecretSource } from '../enums';
import { IdentifiableDto } from './identifiable.dto';

export class UserCredentialsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  login!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class UserInformationDto {
  @ApiProperty()
  @IsDate()
  createdAt!: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  linkedPhone!: string;
}

export class TFASecretDto {
  @ApiProperty()
  @IsEnum(TFASecretSource)
  @IsNotEmpty()
  source!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  secret!: string;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  attachedAt!: Date;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isEnabled!: boolean;
}

export class UserSessionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  source!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  location!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address!: string;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  connectedAt!: Date;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  expires!: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token!: string;
}

// extending UserAccount from IdentifiableDto as we don't create UserAccount and already having defined accounts in the database.
export class UserAccountDto extends IdentifiableDto {
  @ApiProperty({
    type: String,
    description: 'User nickname',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  nickname!: string;

  @ApiProperty()
  @IsString()
  syncNode!: string;

  @ApiProperty()
  @IsNotEmpty()
  credentials!: UserCredentialsDto;

  @ApiProperty()
  @IsNotEmpty()
  twoFAsecrets!: TFASecretDto[];

  @ApiProperty()
  @IsNotEmpty()
  information!: UserInformationDto;

  // attached: any; // If you need to validate this field, you need to create a DTO for it

  @ApiProperty()
  @IsDate()
  lastKeyRotation!: Date;

  @ApiProperty()
  @IsBoolean()
  isRotationSuccess!: boolean;

  @ApiProperty()
  @IsString()
  secretStore!: string;

  @ApiProperty()
  @IsNotEmpty()
  sessions!: UserSessionDto[];
}

export class UserAccountPartialDto extends PartialType(UserAccountDto) {}

export class UserAccountUpdateMsgRequest extends IntersectionType(
  PartialType(UserAccountDto),
  IdentifiableDto, // as we update the user account by id
) {}
