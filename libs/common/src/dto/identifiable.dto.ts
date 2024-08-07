import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IdentifiableDto {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  _id!: string; // default MongoDB DTO that has an _id field

  @ApiProperty()
  @IsOptional()
  $push?: any; // added for now for validation purpose
}
