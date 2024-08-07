import { ValidationError } from 'class-validator';
import { MicroserviceError, RegisterErrorClass } from '../infrastructure';

export type ValidationErrorDetail = { property: string; constraints: string[] };

@RegisterErrorClass
export class RpcValidationError extends MicroserviceError {
  constructor(
    public readonly validationErrors: ValidationErrorDetail[],
    message: string = 'Validation failed',
  ) {
    super(message, validationErrors);
  }

  public static flattenAndConvertValidationErrors(
    validationErrors: ValidationError[],
    propertiesPrefix: string = '',
  ): ValidationErrorDetail[] {
    const details: ValidationErrorDetail[] = [];

    for (const error of validationErrors) {
      if (error.constraints) {
        const constraints = error.constraints;
        const constraintsArray: string[] = Object.keys(constraints).map((key) => `${key}: ${constraints[key]}`);
        details.push({
          property: propertiesPrefix + error.property,
          constraints: constraintsArray,
        });
      }

      if (error.children && error.children.length > 0) {
        details.push(
          ...RpcValidationError.flattenAndConvertValidationErrors(
            error.children,
            propertiesPrefix + error.property + '.',
          ),
        );
      }
    }

    return details;
  }
}
