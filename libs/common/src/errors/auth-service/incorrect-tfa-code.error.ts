import { MicroserviceError } from '../infrastructure';
import { RegisterErrorClass } from '../infrastructure';

type IncorrectTFACodeDetails = {
  source: string;
};

@RegisterErrorClass
export class IncorrectTFACodeError extends MicroserviceError {
  constructor(
    public readonly details: IncorrectTFACodeDetails,
    public readonly message: string = 'Following TFA code is incorrect.',
  ) {
    super(message, details);
  }
}
