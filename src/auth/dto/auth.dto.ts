import { Account } from '@prisma/client';

export default class AuthDto {
  accessToken: string;
  refreshToken: string;
  account: Account;
}
