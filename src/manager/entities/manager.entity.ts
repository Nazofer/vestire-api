import { ApiProperty } from '@nestjs/swagger';
import { Manager as ManagerModel } from '@prisma/client';

export class Manager implements ManagerModel {
  @ApiProperty({ description: 'id' })
  id: string;

  @ApiProperty({ description: 'accountId' })
  accountId: string;

  @ApiProperty({ description: 'updatedAt' })
  updatedAt: Date;

  @ApiProperty({ description: 'firstName' })
  firstName: string;

  @ApiProperty({ description: 'lastName' })
  lastName: string;

  @ApiProperty({ description: 'phone' })
  phone: string;

  @ApiProperty({ description: 'imageUrl', required: false })
  imageUrl: string | null;

  @ApiProperty({ description: 'description', required: false })
  description: string | null;

  @ApiProperty({ description: 'ownerId' })
  ownerId: string;
}
