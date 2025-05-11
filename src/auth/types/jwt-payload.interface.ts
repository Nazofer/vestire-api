import { Account, Owner, Manager, Role } from '@prisma/client';

export type AccountWithRelations = Account & {
  owner: Owner | null;
  manager: Manager | null;
  role: Role | null;
};

export interface JwtPayload {
  account: AccountWithRelations;
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface RequestWithUser extends Request {
  user: JwtPayload;
}
