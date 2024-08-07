import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class UpdateSessionRequest {
  @ApiProperty({
    type: String,
    example: '5f4a3b3b1c9d440000f1f3b3',
    description: 'Steam account ID to update session',
  })
  @IsMongoId()
  steamAccountId!: string;
}

export class UpdateSessionResponse {
  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Flag indicating if session was successfully updated',
  })
  success!: boolean;
}
