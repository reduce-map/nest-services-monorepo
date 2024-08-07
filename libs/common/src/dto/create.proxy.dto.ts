import { ProxyCountry, ProxyStatus, ProxyType } from '@app/common/enums/dto/proxy.dto';
import { Transform } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class ProxyCredentialsDto {
  @IsString()
  login!: string;

  @IsString()
  password!: string;
}

export class CreateProxyDto {
  @IsString()
  proxyIp!: string;

  @IsObject()
  proxyCredentials!: ProxyCredentialsDto;

  @IsArray()
  proxyTypes!: ProxyTypePortDto[];

  @IsEnum(ProxyStatus)
  status!: ProxyStatus;

  @IsOptional()
  @IsString()
  proxyCountry?: ProxyCountry;

  @IsOptional()
  @IsString()
  service?: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  activeUntil!: Date;
}

export class ProxyTypePortDto {
  @IsEnum(ProxyType)
  proxyType!: ProxyType;

  @IsNumber()
  proxyPort!: number;
}
