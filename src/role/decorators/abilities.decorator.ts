import { SetMetadata } from '@nestjs/common';

export interface RequiredRule {
  action: string;
  subject: string;
  conditions?: boolean;
}

export const CHECK_ABILITIES = 'check_abilities';

export const CheckAbilities = (...requirements: RequiredRule[]) =>
  SetMetadata(CHECK_ABILITIES, requirements);
