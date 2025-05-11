import { PrismaClient, RoleType } from '@prisma/client';
import { ulid } from 'ulid';

const roles = [
  {
    id: ulid(),
    name: RoleType.ADMIN,
    description: 'System administrator with full access',
    permissions: [{ action: 'manage', subject: 'all' }],
  },
  {
    id: ulid(),
    name: RoleType.USER,
    description: 'Regular user with limited access',
    permissions: [
      // Organization permissions
      {
        action: 'manage',
        subject: 'organization',
        conditions: { userId: '{{ user_id }}' },
      },
      { action: 'create', subject: 'organization' },

      // Trainer permissions
      {
        action: 'manage',
        subject: 'trainer',
        conditions: { userId: '{{ user_id }}' },
      },
      { action: 'create', subject: 'trainer' },

      // Manager permissions
      {
        action: 'manage',
        subject: 'manager',
        conditions: { userId: '{{ user_id }}' },
      },
      { action: 'create', subject: 'manager' },

      // Equipment permissions
      {
        action: 'manage',
        subject: 'equipment',
        conditions: { userId: '{{ user_id }}' },
      },
      { action: 'create', subject: 'equipment' },

      // Order permissions
      {
        action: 'manage',
        subject: 'order',
        conditions: { userId: '{{ user_id }}' },
      },
      { action: 'create', subject: 'order' },

      // Rental object permissions
      {
        action: 'manage',
        subject: 'rental_object',
        conditions: { userId: '{{ user_id }}' },
      },
      { action: 'create', subject: 'rental_object' },

      // Client permissions
      {
        action: 'manage',
        subject: 'client',
        conditions: { userId: '{{ user_id }}' },
      },
      { action: 'create', subject: 'client' },

      // User permissions
      {
        action: 'manage',
        subject: 'user',
        conditions: { userId: '{{ user_id }}' },
      },
    ],
  },
];

export async function seedRoles(prisma: PrismaClient) {
  console.log('🌱 Seeding roles...');

  for (const roleData of roles) {
    const { permissions, ...roleInfo } = roleData;

    // Створюємо роль
    const role = await prisma.role.upsert({
      where: { id: roleInfo.id },
      update: roleInfo,
      create: roleInfo,
    });

    // Видаляємо старі дозволи
    await prisma.permission.deleteMany({
      where: { roleId: role.id },
    });

    // Створюємо нові дозволи
    for (const permission of permissions) {
      await prisma.permission.create({
        data: {
          id: ulid(),
          roleId: role.id,
          ...permission,
        },
      });
    }
  }

  console.log('✅ Roles seeded successfully');
}
