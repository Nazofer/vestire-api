import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleService } from '../../role/role.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  ForbiddenError,
  MongoAbility,
  createMongoAbility,
} from '@casl/ability';
import { Account } from '@prisma/client';

export const CHECK_ABILITY = 'check_ability';

export interface RequiredRule {
  action: string;
  subject: string;
  conditions?: any;
}

export const checkAbilities = (...requirements: RequiredRule[]) =>
  SetMetadata(CHECK_ABILITY, requirements);

export const actions = [
  'read',
  'manage',
  'create',
  'update',
  'delete',
] as const;
export const subjects = [
  'order',
  'profile',
  'equipment',
  'personal',
  'all',
] as const;

type Abilities = [(typeof actions)[number], (typeof subjects)[number]];

export type AppAbility = MongoAbility<Abilities>;

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly roleService: RoleService,
    private readonly prisma: PrismaService,
  ) {}

  createAbility = (rules: any[]): AppAbility =>
    createMongoAbility<AppAbility>(rules);

  async getObject(subject: string, id: string): Promise<any> {
    const model = subject.charAt(0).toUpperCase() + subject.slice(1);
    const object = await this.prisma[subject].findUnique({
      where: { id },
      include: {
        account: true,
      },
    });

    if (!object) {
      throw new NotFoundException(`${model} not found`);
    }

    return object;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rules =
      this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) ||
      [];
    const request = context.switchToHttp().getRequest();
    const user = request.user as Account;

    if (!user) {
      return false;
    }

    // Отримуємо роль та дозволи користувача
    const account = await this.prisma.account.findUnique({
      where: { id: user.id },
      include: {
        role: {
          include: {
            RolePermission: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!account?.role) {
      return false;
    }

    // Адміністратор має всі дозволи
    if (account.role.type === 'ADMIN') {
      return true;
    }

    // Конвертуємо дозволи в формат CASL
    const permissions = account.role.RolePermission.map((rp) => {
      const [action, subject] = rp.permission.name.split('_');
      return {
        action: action as (typeof actions)[number],
        subject: subject as (typeof subjects)[number],
      };
    });

    try {
      const ability = this.createAbility(permissions);

      for (const rule of rules) {
        if (rule.conditions) {
          const subjectId = request.params['id'] as string;
          const subjectData = await this.getObject(rule.subject, subjectId);
          // Перевіряємо дозволи з урахуванням умов
          ForbiddenError.from(ability)
            .setMessage('You are not allowed to perform this action')
            .throwUnlessCan(rule.action as (typeof actions)[number], {
              ...subjectData,
              __caslSubjectType__: rule.subject as (typeof subjects)[number],
            });
        } else {
          ForbiddenError.from(ability)
            .setMessage('You are not allowed to perform this action')
            .throwUnlessCan(
              rule.action as (typeof actions)[number],
              rule.subject as (typeof subjects)[number],
            );
        }
      }
      return true;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
      throw error;
    }
  }
}
