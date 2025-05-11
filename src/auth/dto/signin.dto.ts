import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class SignInDTO {
  @ApiProperty({
    description: 'Email користувача',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Пароль користувача',
    example: 'password123',
  })
  @IsNotEmpty()
  password: string;
}
