import { ApiProperty } from '@nestjs/swagger';
import { AccountStatus } from '@prisma/client';

export class AccountResponseDto {
  @ApiProperty({
    description: 'ID акаунту',
    example: '01HXSAX1N8B8X9VZ4K8YQZ4QZ4',
  })
  id: string;

  @ApiProperty({
    description: 'Email акаунту',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Статус акаунту',
    enum: AccountStatus,
    example: AccountStatus.ACTIVE,
  })
  status: AccountStatus;

  @ApiProperty({
    description: 'ID ролі',
    example: '01HXSAX1N8B8X9VZ4K8YQZ4QZ4',
  })
  roleId: string;

  @ApiProperty({
    description: 'Дата оновлення',
    example: '2024-03-11T12:00:00Z',
  })
  updatedAt: Date;
}
