import { PrismaClient } from '@prisma/client';
import { ulid } from 'ulid';

const permissions = [
  // Дозволи для ордерів
  { name: 'read_order', description: 'Can read orders' },
  { name: 'create_order', description: 'Can create orders' },
  { name: 'update_order', description: 'Can update orders' },
  { name: 'delete_order', description: 'Can delete orders' },
  { name: 'manage_order', description: 'Can manage all orders' },

  // Дозволи для профілю
  { name: 'read_profile', description: 'Can read profile' },
  { name: 'update_profile', description: 'Can update profile' },
  { name: 'delete_profile', description: 'Can delete profile' },

  // Дозволи для обладнання
  { name: 'read_equipment', description: 'Can read equipment' },
  { name: 'create_equipment', description: 'Can create equipment' },
  { name: 'update_equipment', description: 'Can update equipment' },
  { name: 'delete_equipment', description: 'Can delete equipment' },
  { name: 'manage_equipment', description: 'Can manage all equipment' },

  // Дозволи для персоналу
  { name: 'read_personal', description: 'Can read personal' },
  { name: 'create_personal', description: 'Can create personal' },
  { name: 'update_personal', description: 'Can update personal' },
  { name: 'delete_personal', description: 'Can delete personal' },
  { name: 'manage_personal', description: 'Can manage all personal' },

  // Дозволи для організацій
  { name: 'read_organization', description: 'Can read organization' },
  { name: 'create_organization', description: 'Can create organization' },
  { name: 'update_organization', description: 'Can update organization' },
  { name: 'delete_organization', description: 'Can delete organization' },
  { name: 'manage_organization', description: 'Can manage all organizations' },
];

export async function seedPermissions(prisma: PrismaClient) {
  console.log('🌱 Seeding permissions...');

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: {
        id: ulid(),
        ...permission,
      },
    });
  }

  console.log('✅ Permissions seeded successfully');
}
