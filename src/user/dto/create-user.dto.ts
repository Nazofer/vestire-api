import { IsEmail, ValidateNested } from 'class-validator';
import { UserDto } from './user.dto';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @ValidateNested()
  @Type(() => UserDto)
  user?: UserDto;
}
