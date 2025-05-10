import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('RoleController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();

    // Очищаємо базу даних перед тестами
    await prisma.rolePermission.deleteMany();
    await prisma.role.deleteMany();
    await prisma.account.deleteMany();

    // Створюємо тестовий акаунт
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'testPassword123',
      });

    accessToken = response.body.accessToken;
  });

  afterAll(async () => {
    await prisma.rolePermission.deleteMany();
    await prisma.role.deleteMany();
    await prisma.account.deleteMany();
    await app.close();
  });

  describe('Управління ролями', () => {
    it('повинен створити нову роль', async () => {
      const response = await request(app.getHttpServer())
        .post('/roles')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          type: 'ADMIN',
          name: 'Test Role',
          description: 'Test Role Description',
        })
        .expect(201);

      expect(response.body).toHaveProperty('name', 'Test Role');
      expect(response.body).toHaveProperty(
        'description',
        'Test Role Description',
      );
    });

    it('повинен отримати список ролей', async () => {
      const response = await request(app.getHttpServer())
        .get('/roles')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('повинен оновити роль', async () => {
      // Спочатку створюємо роль
      const createResponse = await request(app.getHttpServer())
        .post('/roles')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          type: 'ADMIN',
          name: 'Role to Update',
          description: 'Original Description',
        });

      const roleId = createResponse.body.id;

      // Оновлюємо роль
      const response = await request(app.getHttpServer())
        .patch(`/roles/${roleId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Updated Role',
          description: 'Updated Description',
        })
        .expect(200);

      expect(response.body).toHaveProperty('name', 'Updated Role');
      expect(response.body).toHaveProperty(
        'description',
        'Updated Description',
      );
    });

    it('повинен видалити роль', async () => {
      // Спочатку створюємо роль
      const createResponse = await request(app.getHttpServer())
        .post('/roles')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          type: 'ADMIN',
          name: 'Role to Delete',
          description: 'To be deleted',
        });

      const roleId = createResponse.body.id;

      // Видаляємо роль
      await request(app.getHttpServer())
        .delete(`/roles/${roleId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // Перевіряємо, що роль видалена
      await request(app.getHttpServer())
        .get(`/roles/${roleId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('Управління дозволами ролей', () => {
    let roleId: string;

    beforeEach(async () => {
      // Створюємо роль для тестів дозволів
      const response = await request(app.getHttpServer())
        .post('/roles')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          type: 'ADMIN',
          name: 'Role with Permissions',
          description: 'For testing permissions',
        });

      roleId = response.body.id;
    });

    it('повинен додати дозвіл до ролі', async () => {
      const response = await request(app.getHttpServer())
        .post(`/roles/${roleId}/permissions`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          action: 'create',
          subject: 'user',
        })
        .expect(201);

      expect(response.body).toHaveProperty('action', 'create');
      expect(response.body).toHaveProperty('subject', 'user');
    });

    it('повинен отримати список дозволів ролі', async () => {
      // Спочатку додаємо дозвіл
      await request(app.getHttpServer())
        .post(`/roles/${roleId}/permissions`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          action: 'read',
          subject: 'user',
        });

      const response = await request(app.getHttpServer())
        .get(`/roles/${roleId}/permissions`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('action');
      expect(response.body[0]).toHaveProperty('subject');
    });

    it('повинен видалити дозвіл з ролі', async () => {
      // Спочатку додаємо дозвіл
      const permissionResponse = await request(app.getHttpServer())
        .post(`/roles/${roleId}/permissions`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          action: 'delete',
          subject: 'user',
        });

      const permissionId = permissionResponse.body.id;

      // Видаляємо дозвіл
      await request(app.getHttpServer())
        .delete(`/roles/${roleId}/permissions/${permissionId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // Перевіряємо, що дозвіл видалено
      const permissions = await request(app.getHttpServer())
        .get(`/roles/${roleId}/permissions`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(
        permissions.body.find((p) => p.id === permissionId),
      ).toBeUndefined();
    });
  });
});
