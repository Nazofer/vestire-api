import { Owner } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class User implements Owner {
  @ApiProperty({
    description: 'id',
  })
  id: string;

  @ApiProperty({
    description: 'firstName',
  })
  firstName: string;

  @ApiProperty({
    description: 'lastName',
  })
  lastName: string;

  @ApiProperty({
    description: 'phone',
  })
  phone: string;

  @ApiProperty({
    description: 'siteUrl',
    required: false,
  })
  siteUrl: string | null;

  @ApiProperty({
    description: 'imageUrl',
    required: false,
  })
  imageUrl: string | null;

  @ApiProperty({
    description: 'description',
    required: false,
  })
  description: string | null;

  @ApiProperty({
    description: 'accountId',
    required: false,
  })
  accountId: string | null;

  @ApiProperty({
    description: 'updatedAt',
  })
  updatedAt: Date;
}
