import { MicroserviceError } from '../infrastructure';
import { RegisterErrorClass } from '../infrastructure';

@RegisterErrorClass
export class JwtTokenInvalidError extends MicroserviceError {
  constructor(
    public readonly details?: unknown,
    message: string = 'JWT token is invalid',
  ) {
    super(message, details);
  }
}
