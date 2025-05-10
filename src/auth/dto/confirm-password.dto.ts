import { IsString, IsNotEmpty } from 'class-validator';

export default class ConfirmPasswordDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
