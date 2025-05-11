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

export const actions = ['manage', 'create'] as const;
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

type Action = (typeof actions)[number];
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
        return await this.prisma.owner.findUnique({
          where: { id },
        });
      },
      user: async (id: string) => {
        return await this.prisma.owner.findUnique({
          where: { id },
        });
      },
    };

    const query = queries[subject];
    if (!query) {
      throw new NotFoundException(`Subject ${subject} not found`);
    }

    const result = await query(id);
    if (!result) {
      throw new NotFoundException(`${subject} with id ${id} not found`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result;
  }

  // Map controller decorator actions to our simplified permission model
  private mapActionToPermission(action: string): Action {
    // Map read/update/delete to 'manage'
    if (['read', 'update', 'delete'].includes(action)) {
      return 'manage';
    }
    // Keep 'create' and 'manage' as is
    return action as Action;
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
      throw new ForbiddenException('User not authenticated');
    }

    const account = await this.prisma.account.findUnique({
      where: { id: user.id },
      include: {
        owner: true,
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    if (!account?.role) {
      throw new ForbiddenException('User has no role assigned');
    }

    // Check for admin 'manage all' permission first
    const hasManageAll = account.role.permissions.some(
      (permission) =>
        permission.action === 'manage' && permission.subject === 'all',
    );

    if (hasManageAll) {
      return true;
    }

    // Check each required rule
    for (const rule of rules) {
      // Map rule action to our simplified permission model
      const requiredAction = this.mapActionToPermission(rule.action);

      const hasPermission = await Promise.all(
        account.role.permissions.map(async (permission) => {
          // Check if action and subject match
          if (
            permission.action !== requiredAction ||
            permission.subject !== rule.subject
          ) {
            return false;
          }

          // If no conditions needed or no conditions on the permission, we're done
          if (!rule.conditions || !permission.conditions) {
            return true;
          }

          // If conditions are required, check them
          const parsedConditions = this.parseCondition(permission, user);
          const subjectId = request.params.id || request.query.organizationId;

          if (subjectId) {
            try {
              const subject = await this.getObject(
                rule.subject as Subject,
                subjectId,
              );
              return Object.entries(parsedConditions).every(([key, value]) => {
                if (key === 'userId') {
                  return (
                    value === subject.userId ||
                    value === subject.Organization?.userId
                  );
                }
                return subject[key] === value;
              });
            } catch {
              return false;
            }
          }

          return true;
        }),
      ).then((results) => results.some((result) => result));

      if (!hasPermission) {
        throw new ForbiddenException(
          `Insufficient permissions for ${rule.action} on ${rule.subject}`,
        );
      }
    }

    return true;
  }
}
