import { MicroserviceError } from '../infrastructure';
import { RegisterErrorClass } from '../infrastructure';

@RegisterErrorClass
export class UserNotFoundError extends MicroserviceError {
  constructor(
    public readonly details?: unknown,
    public readonly message: string = 'There is no user with such credentials.',
  ) {
    super(message, details);
  }
}
