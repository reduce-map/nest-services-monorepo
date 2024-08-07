import { ClientRMQ } from '@nestjs/microservices';
import { reconstructMicroserviceError } from './microservice-errors.infrastructure';

export class CustomRMQClientProxy extends ClientRMQ {
  serializeError(error: any) {
    if (error && error.microserviceErrorType) {
      const deserializedError = reconstructMicroserviceError(error);
      return deserializedError;
    }
    return error;
  }
}
