import { ApiProperty } from '@nestjs/swagger';
import { Account } from '@/account/entities/account.entity';

export default class AuthDto {
  @ApiProperty({
    description: 'Токен доступу',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Токен оновлення',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Інформація про акаунт',
    type: Account,
  })
  account: Account;
}
