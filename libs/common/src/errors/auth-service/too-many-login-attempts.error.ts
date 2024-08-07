import { MicroserviceError, RegisterErrorClass } from '../infrastructure';

export type TooManyLoginAttemptsDetails = {
  tryAgainAfterMs: number;
};
@RegisterErrorClass
export class TooManyLoginAttemptsError extends MicroserviceError {
  constructor(
    public readonly details: TooManyLoginAttemptsDetails,
    message?: string,
  ) {
    if (!message) message = `Too many login attempts. Try again after ${details.tryAgainAfterMs / 1000} seconds.`;
    super(message, details);
  }
}
