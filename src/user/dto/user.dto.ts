import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsMobilePhone,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: "Ім'я користувача",
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Прізвище користувача',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Номер телефону користувача',
    example: '+380501234567',
  })
  @IsMobilePhone('uk-UA')
  phone: string;

  @ApiProperty({
    description: 'URL сайту користувача',
    example: 'https://example.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  siteUrl?: string;

  @ApiProperty({
    description: 'URL зображення користувача',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({
    description: 'Опис користувача',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
