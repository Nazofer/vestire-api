import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { AccountStatus } from '@prisma/client';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let refreshToken: string;
  let accountId: string;

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
  });

  afterAll(async () => {
    await prisma.rolePermission.deleteMany();
    await prisma.role.deleteMany();
    await prisma.account.deleteMany();
    await app.close();
  });

  describe('Реєстрація та авторизація', () => {
    const testEmail = 'test@example.com';
    const testPassword = 'testPassword123';

    it('повинен створити перший акаунт як суперкористувач', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testEmail,
          password: testPassword,
        })
        .expect(201);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.account).toHaveProperty('email', testEmail);
      expect(response.body.account).toHaveProperty(
        'status',
        AccountStatus.ACTIVE,
      );

      accessToken = response.body.accessToken;
      refreshToken = response.body.refreshToken;
      accountId = response.body.account.id;
    });

    it('повинен увійти в існуючий акаунт', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testEmail,
          password: testPassword,
        })
        .expect(201);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.account).toHaveProperty('email', testEmail);
    });

    it('повинен повернути помилку при неправильному паролі', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testEmail,
          password: 'wrongPassword',
        })
        .expect(401);
    });
  });

  describe('Оновлення токенів', () => {
    it('повинен оновити токени', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${refreshToken}`)
        .expect(201);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.account).toHaveProperty('email', 'test@example.com');

      accessToken = response.body.accessToken;
      refreshToken = response.body.refreshToken;
    });

    it('повинен повернути помилку при використанні невалідного токена', async () => {
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', 'Bearer invalid_token')
        .expect(401);
    });
  });

  describe('Підтвердження пароля', () => {
    it('повинен підтвердити новий пароль', async () => {
      const newPassword = 'newPassword123';

      await request(app.getHttpServer())
        .post('/auth/confirm-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          id: accountId,
          password: newPassword,
        })
        .expect(201);

      // Перевіряємо, що можемо увійти з новим паролем
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: newPassword,
        })
        .expect(201);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });
  });

  describe('Отримання інформації про акаунт', () => {
    it('повинен отримати інформацію про акаунт', async () => {
      const response = await request(app.getHttpServer())
        .get(`/auth/account/${accountId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('email', 'test@example.com');
      expect(response.body).toHaveProperty('status', AccountStatus.ACTIVE);
    });

    it('повинен повернути помилку при спробі отримати інформацію без токена', async () => {
      await request(app.getHttpServer())
        .get(`/auth/account/${accountId}`)
        .expect(401);
    });
  });
});
