import { UserDto } from './user.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(UserDto) {
  @ApiProperty({
    description: 'Зображення користувача',
    example: 'base64-encoded-image-string',
  })
  imageUrl: string;
}
