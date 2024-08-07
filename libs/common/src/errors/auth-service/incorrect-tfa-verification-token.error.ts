import { MicroserviceError, RegisterErrorClass } from '../infrastructure';

@RegisterErrorClass
export class IncorrectTfaVerificationTokenError extends MicroserviceError {
  constructor(
    public readonly details?: unknown,
    public readonly message: string = 'Incorrect TFA verification ID',
  ) {
    super(message, details);
  }
}
