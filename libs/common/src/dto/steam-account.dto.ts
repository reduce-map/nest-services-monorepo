import { ApiProperty } from '@nestjs/swagger';
import { IsString, ValidateNested } from 'class-validator';

export class SteamAccountCredentialsDto {
  @ApiProperty()
  @IsString()
  login!: string;

  @ApiProperty()
  @IsString()
  password!: string;

  @ApiProperty()
  @IsString()
  shared_secret!: string;

  @ApiProperty()
  @IsString()
  identity_secret!: string;

  @ApiProperty()
  @IsString()
  refresh_token?: string;
}

export class SteamAccountStatusesInformationDto {
  @ApiProperty({
    type: 'object',
    additionalProperties: {
      oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'object' } }],
    },
  })
  @ValidateNested()
  // applyingStatuses?: Map<string, any>;
  applyingStatuses?: Record<string, any>;

  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'array', items: { type: 'object' } },
  })
  @ValidateNested()
  // sourceStatuses?: Map<string, any[]>;
  sourceStatuses?: Record<string, any[]>;
}

export class SteamAccountInformationDto {
  @ApiProperty({
    description: 'Currency for the Steam account',
  })
  @IsString()
  currency!: string;

  @ApiProperty({
    description: 'Privacy setting for the Steam account',
  })
  @IsString()
  privacySetting!: string;

  @ApiProperty({
    description: 'Account level for the Steam account',
  })
  @IsString()
  accountLevel!: number;

  @ApiProperty({
    description: 'Account email for the Steam account',
  })
  @IsString()
  accountEmail?: string;

  @ApiProperty({
    description: 'Account simcard for the Steam account',
  })
  @IsString()
  accountSimcard?: string;
}

export class SteamAccountAttachedDto {
  @ApiProperty()
  @IsString()
  defaultProxy?: string;

  @ApiProperty()
  @ValidateNested()
  cookie?: any[];

  @ApiProperty()
  @ValidateNested()
  backupProxies?: string[];
}

export class SteamAccountDto {
  @ApiProperty()
  @IsString()
  ownerKey?: string;

  @ApiProperty()
  @IsString()
  steamId64!: string;

  @ApiProperty()
  @IsString()
  apiKey!: string;

  @ApiProperty()
  @IsString()
  accIndex?: number;

  @ApiProperty()
  @ValidateNested()
  credentials!: SteamAccountCredentialsDto;

  @ApiProperty()
  @ValidateNested()
  information?: SteamAccountStatusesInformationDto;

  @ApiProperty()
  @ValidateNested()
  accountInformation?: SteamAccountInformationDto;

  @ApiProperty()
  @ValidateNested()
  attached?: SteamAccountAttachedDto;
}
