import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { RoleService } from 'src/role/role.service';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from '@/prisma/prisma.service';
import { Manager, Prisma, RoleType } from '@prisma/client';
import { ulid } from 'ulid';
import { AuthService } from '@/auth/auth.service';
import { JwtPayload } from '@/auth/types/jwt-payload.interface';

@Injectable()
export class ManagerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly roleService: RoleService,
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  async findOne(id: string): Promise<Manager> {
    const user = await this.prisma.manager.findUnique({
      where: { id },
      include: {
        account: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`Користувача з id ${id} не знайдено`);
    }

    return user;
  }

  async findAll(data: JwtPayload): Promise<Manager[]> {
    return await this.prisma.manager.findMany({
      where: {
        ownerId: data.account.owner.id,
      },
      include: {
        account: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async create(
    payload: JwtPayload,
    data: CreateManagerDto,
  ): Promise<{ verifyToken: string }> {
    try {
      // Отримуємо роль B2B_CLIENT
      const { id: roleId } = await this.roleService.getByName(RoleType.MANAGER);

      // Створюємо акаунт з роллю
      const account = await this.prisma.account.create({
        data: {
          id: ulid(),
          email: data.email,
          roleId,
        },
      });

      await this.prisma.manager.create({
        data: {
          id: ulid(),
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          description: data.description,
          owner: {
            connect: {
              id: payload.account.owner.id,
            },
          },
          account: {
            connect: {
              id: account.id,
            },
          },
        },
        include: {
          account: {
            include: {
              role: true,
            },
          },
        },
      });

      const verifyToken = await this.authService.generateVerifyToken({
        id: account.id,
        email: account.email,
      });

      this.mailService.sendMail({
        to: account.email,
        subject: 'Підтвердження електронної пошти',
        text: `Щоб підтвердити свій email, перейдіть за посиланням: http://127.0.0.1:8080/activate-account?verify_token=${verifyToken}`,
      });

      return { verifyToken };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Користувач з такими даними вже існує');
        }
      }
      throw error;
    }
  }

  async update(id: string, data: UpdateManagerDto): Promise<Manager> {
    try {
      return await this.prisma.manager.update({
        where: { id },
        data,
        include: {
          account: {
            include: {
              role: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Користувача з id ${id} не знайдено`);
        }
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.manager.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Користувача з id ${id} не знайдено`);
        }
      }
      throw error;
    }
  }
}
