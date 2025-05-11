import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateEquipmentDto {
  @ApiProperty({ description: 'name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'price' })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'rentalObjectId',
  })
  @IsNotEmpty()
  @IsString()
  rentalObjectId: string;

  @ApiProperty({ description: 'imageUrl', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ description: 'state', required: false })
  @IsOptional()
  @IsString()
  state?: string;
}
