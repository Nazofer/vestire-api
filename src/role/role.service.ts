import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, RoleType, RolePermission } from '@prisma/client';
import { ulid } from 'ulid';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async createRole(data: {
    type: RoleType;
    name: string;
    description?: string;
  }): Promise<Role> {
    return await this.prisma.role.create({
      data: {
        id: ulid(),
        ...data,
      },
    });
  }

  async getRoles(): Promise<Role[]> {
    return await this.prisma.role.findMany();
  }

  async getRole(id: string): Promise<Role> {
    return await this.prisma.role.findUniqueOrThrow({
      where: { id },
    });
  }

  async updateRole(
    id: string,
    data: { name?: string; description?: string },
  ): Promise<Role> {
    return await this.prisma.role.update({
      where: { id },
      data,
    });
  }

  async deleteRole(id: string): Promise<Role> {
    return await this.prisma.role.delete({
      where: { id },
    });
  }

  async assignRoleToAccount(accountId: string, roleId: string): Promise<void> {
    await this.prisma.account.update({
      where: { id: accountId },
      data: { roleId },
    });
  }

  async createPermission(
    roleId: string,
    data: { action: string; subject: string },
  ): Promise<RolePermission> {
    const permission = await this.prisma.permission.create({
      data: {
        id: ulid(),
        name: `${data.action}_${data.subject}`,
      },
    });

    return await this.prisma.rolePermission.create({
      data: {
        id: ulid(),
        roleId,
        permissionId: permission.id,
      },
    });
  }

  async getPermissions(roleId: string): Promise<RolePermission[]> {
    return await this.prisma.rolePermission.findMany({
      where: { roleId },
      include: { permission: true },
    });
  }

  async removePermissionFromRole(
    roleId: string,
    permissionId: string,
  ): Promise<void> {
    await this.prisma.rolePermission.delete({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId,
        },
      },
    });
  }

  async assignAllPermissionsToAdmin(adminRoleId: string): Promise<void> {
    const allPermissions = await this.prisma.permission.findMany();

    for (const permission of allPermissions) {
      await this.prisma.rolePermission.create({
        data: {
          id: ulid(),
          roleId: adminRoleId,
          permissionId: permission.id,
        },
      });
    }
  }

  async assignClientPermissions(clientRoleId: string): Promise<void> {
    const clientPermissions = [
      'view_own_orders',
      'create_own_orders',
      'update_own_orders',
      'delete_own_orders',
      'view_own_profile',
      'update_own_profile',
    ];

    for (const permissionName of clientPermissions) {
      const permission = await this.prisma.permission.findUnique({
        where: { name: permissionName },
      });

      if (permission) {
        await this.prisma.rolePermission.create({
          data: {
            id: ulid(),
            roleId: clientRoleId,
            permissionId: permission.id,
          },
        });
      }
    }
  }

  async checkPermission(
    accountId: string,
    permissionName: string,
  ): Promise<boolean> {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
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

    if (!account?.role) return false;

    // Адміністратор має всі дозволи
    if (account.role.type === RoleType.ADMIN) return true;

    // Перевіряємо конкретний дозвіл для інших ролей
    return account.role.RolePermission.some(
      (rp) => rp.permission.name === permissionName,
    );
  }
}
