import { Global, Module } from '@nestjs/common';
import { LoggerService, getLoggerService } from './logger.service';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    {
      provide: LoggerService,
      useFactory: getLoggerService,
      inject: [ConfigService],
    },
  ],
  exports: [LoggerService],
})
export class LoggerModule {}
