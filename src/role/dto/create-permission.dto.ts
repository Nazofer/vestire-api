import { IsString, IsOptional } from 'class-validator';

export default class PermissionDto {
  @IsString()
  action: string;

  @IsString()
  subject: string;

  @IsOptional()
  conditions?: any;
}
