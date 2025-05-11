import { Role } from '@/role/entities/role.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Account as AccountPrisma, AccountStatus } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class Account implements AccountPrisma {
  @ApiProperty({ description: 'id' })
  id: string;

  @ApiProperty({ description: 'email' })
  email: string;

  @Exclude()
  password: string | null;

  @ApiProperty({ description: 'status' })
  status: AccountStatus;

  @ApiProperty({ description: 'roleId' })
  roleId: string | null;

  @ApiProperty({ description: 'role', type: () => Role })
  role: Role;

  @ApiProperty({ description: 'updatedAt' })
  updatedAt: Date;
}
