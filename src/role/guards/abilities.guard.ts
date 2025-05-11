import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  CHECK_ABILITIES,
  RequiredRule,
} from '../decorators/abilities.decorator';
import { PrismaService } from '@/prisma/prisma.service';
import { JwtPayload } from '@/auth/types/jwt-payload.interface';
import { render } from 'mustache';

export const actions = [
  'read',
  'manage',
  'create',
  'update',
  'delete',
] as const;
export const subjects = [
  'organization',
  'trainer',
  'manager',
  'equipment',
  'order',
  'rental_object',
  'client',
  'user',
  'all',
] as const;

// type Action = (typeof actions)[number];
type Subject = (typeof subjects)[number];

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  private async getObject(subject: Subject, id: string) {
    const queries = {
      rental_object: async (id: string) => {
        return await this.prisma.rentalObject.findUnique({
          where: { id },
          include: {
            Organization: true,
          },
        });
      },
      organization: async (id: string) => {
        return await this.prisma.organization.findUnique({
          where: { id },
        });
      },
      trainer: async (id: string) => {
        return await this.prisma.personal.findUnique({
          where: { id },
        });
      },
      manager: async (id: string) => {
        return await this.prisma.personal.findUnique({
          where: { id },
        });
      },
      equipment: async (id: string) => {
        return await this.prisma.equipment.findUnique({
          where: { id },
        });
      },
      order: async (id: string) => {
        return await this.prisma.order.findUnique({
          where: { id },
        });
      },
      client: async (id: string) => {
        return await this.prisma.b2BClient.findUnique({
          where: { id },
        });
      },
      user: async (id: string) => {
        return await this.prisma.b2BClient.findUnique({
          where: { id },
        });
      },
    };

    const query = queries[subject];
    if (!query) {
      throw new NotFoundException(`Subject ${subject} not found`);
    }

    try {
      const result = await query(id);
      if (!result) {
        throw new NotFoundException(`${subject} with id ${id} not found`);
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`${subject} with id ${id} not found`);
    }
  }

  private parseCondition(permission: any, user: JwtPayload) {
    if (permission.conditions) {
      const conditions = permission.conditions as Record<string, string>;
      return Object.entries(conditions).reduce(
        (acc, [key, value]) => {
          acc[key] = render(value, { user_id: user.id });
          return acc;
        },
        {} as Record<string, string>,
      );
    }
    return null;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rules = this.reflector.get<RequiredRule[]>(
      CHECK_ABILITIES,
      context.getHandler(),
    );

    if (!rules) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    if (!user?.id) {
      throw new ForbiddenException('Користувач не авторизований');
    }

    const account = await this.prisma.account.findUnique({
      where: { id: user.id },
      include: {
        user: true,
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    if (!account?.role) {
      throw new ForbiddenException('У користувача немає ролі');
    }

    // Перевіряємо дозвіл на керування всім
    const hasManageAll = account.role.permissions.some(
      (permission) =>
        permission.action === 'manage' && permission.subject === 'all',
    );

    if (hasManageAll) {
      return true;
    }

    // Перевіряємо кожен необхідний дозвіл
    for (const rule of rules) {
      const hasPermission = account.role.permissions.some((permission) => {
        if (
          permission.action !== rule.action ||
          permission.subject !== rule.subject
        ) {
          return false;
        }

        // Якщо є умови, перевіряємо їх
        if (permission.conditions) {
          const parsedConditions = this.parseCondition(permission, user);
          const subjectId = request.params.id || request.query.organizationId;

          if (subjectId) {
            return this.getObject(rule.subject as Subject, subjectId).then(
              (subject) => {
                return Object.entries(parsedConditions).every(
                  ([key, value]) => {
                    if (key === 'userId') {
                      return (
                        value === subject.userId ||
                        value === subject.Organization?.userId
                      );
                    }
                    return subject[key] === value;
                  },
                );
              },
            );
          }
        }

        return true;
      });

      if (!hasPermission) {
        throw new ForbiddenException(
          `Недостатньо прав для виконання дії ${rule.action} над ${rule.subject}`,
        );
      }
    }

    return true;
  }
}
