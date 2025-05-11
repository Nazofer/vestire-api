import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class ConfirmPasswordDto {
  @ApiProperty({
    description: 'Новий пароль',
    example: 'newPassword123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
