import { PrismaClient, RoleType } from '@prisma/client';
import { ulid } from 'ulid';

const roles = [
  {
    type: RoleType.ADMIN,
    name: 'Administrator',
    description: 'System administrator with full access',
    permissions: [
      'read_order',
      'create_order',
      'update_order',
      'delete_order',
      'manage_order',
      'read_profile',
      'update_profile',
      'delete_profile',
      'read_equipment',
      'create_equipment',
      'update_equipment',
      'delete_equipment',
      'manage_equipment',
      'read_personal',
      'create_personal',
      'update_personal',
      'delete_personal',
      'manage_personal',
      'read_organization',
      'create_organization',
      'update_organization',
      'delete_organization',
      'manage_organization',
    ],
  },
  {
    type: RoleType.B2B_CLIENT,
    name: 'B2B Client',
    description: 'B2B client with limited access',
    permissions: [
      'read_order',
      'create_order',
      'update_order',
      'delete_order',
      'read_profile',
      'update_profile',
      'read_equipment',
      'read_personal',
      'read_organization',
    ],
  },
];

export async function seedRoles(prisma: PrismaClient) {
  console.log('🌱 Seeding roles...');

  for (const roleData of roles) {
    const { permissions, ...roleInfo } = roleData;

    // Створюємо роль
    const existingRole = await prisma.role.findFirst({
      where: { name: roleInfo.name },
    });

    const role = await prisma.role.upsert({
      where: { id: existingRole?.id || ulid() },
      update: roleInfo,
      create: {
        id: ulid(),
        ...roleInfo,
      },
    });

    // Отримуємо всі дозволи
    const permissionRecords = await prisma.permission.findMany({
      where: {
        name: {
          in: permissions,
        },
      },
    });

    // Створюємо зв'язки між роллю та дозволами
    for (const permission of permissionRecords) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          id: ulid(),
          roleId: role.id,
          permissionId: permission.id,
        },
      });
    }
  }

  console.log('✅ Roles seeded successfully');
}
