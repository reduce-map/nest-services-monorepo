import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export enum LoggerConfigPropertyNames {
  LOG_DESTINATION = 'LOG_DESTINATION',
}

@Injectable()
export class LoggerService {
  private logger: any;
  constructor(path: string) {
    this.logger = console
  }
  error(message: string): void {
    this.logger.error(message);
  }
  warn(message: string): void {
    this.logger.warn(message);
  }
  info(message: string): void {
    this.logger.info(message);
  }
}

let logger: LoggerService;
export function getLoggerService(configService: ConfigService): LoggerService {
  const logDestination = configService.getOrThrow(LoggerConfigPropertyNames.LOG_DESTINATION);
  return logger || (logger = new LoggerService(logDestination));
}
