import { IsEnum } from 'class-validator';
import { RoleType } from '@prisma/client';

export default class RoleDto {
  @IsEnum(RoleType)
  name: RoleType;
}
