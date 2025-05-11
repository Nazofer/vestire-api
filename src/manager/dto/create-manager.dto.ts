import { IsEmail, IsMobilePhone, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateManagerDto {
  @ApiProperty({ description: 'email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'firstName' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'lastName' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'phone' })
  @IsMobilePhone('uk-UA')
  phone: string;

  @ApiProperty({ description: 'description', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
