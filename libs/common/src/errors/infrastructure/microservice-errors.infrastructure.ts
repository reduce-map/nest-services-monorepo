import { RpcException } from '@nestjs/microservices';

export const errorTypesMap: Map<string, { new (...args: any[]): MicroserviceError }> = new Map();

export type ObjectError = {
  microserviceErrorType: string;
  message: string;
  details: any;
};

export function reconstructMicroserviceError(error: ObjectError): MicroserviceError {
  const DefinedError = errorTypesMap.get(error.microserviceErrorType);
  if (DefinedError) {
    const errorInstance = new DefinedError(error.details, error.message);
    errorInstance.stack = undefined;
    return errorInstance;
  }
  const errorInstance = new MicroserviceError(error.message, error.details);
  errorInstance.stack = undefined;
  return errorInstance;
}

type RpcExceptionType = new (...args: any[]) => RpcException;

export function RegisterErrorClass(target: RpcExceptionType) {
  const typeName = target.name;
  errorTypesMap.set(typeName, target as any);
}

@RegisterErrorClass
export class MicroserviceError extends RpcException {
  constructor(
    message: string,
    public readonly details?: any,
  ) {
    super({
      message,
      details,
      microserviceErrorType: new.target.name,
    });
    this.name = this.constructor.name; // remove
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
