import { IsEmail, ValidateNested } from 'class-validator';
import { UserDto } from './user.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email користувача',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Дані користувача',
    type: UserDto,
  })
  @ValidateNested()
  @Type(() => UserDto)
  user?: UserDto;
}
