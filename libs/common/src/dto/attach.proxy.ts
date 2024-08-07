import { IsString } from 'class-validator';

export class AttachProxyRequest {
  @IsString()
  steamAccountId!: string;

  @IsString()
  proxyId!: string;
}
