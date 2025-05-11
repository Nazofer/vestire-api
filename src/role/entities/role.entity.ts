import { Role as RolePrisma, RoleType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
export class Role implements RolePrisma {
  @ApiProperty({ description: 'id' })
  id: string;

  @ApiProperty({ description: 'name' })
  name: RoleType;

  @ApiProperty({ description: 'description', required: false })
  description: string | null;

  @ApiProperty({ description: 'updatedAt' })
  updatedAt: Date;
}
