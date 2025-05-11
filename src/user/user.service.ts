import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { PaginationRequestDto } from './dto/query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { B2BClient, Prisma, RoleType } from '@prisma/client';
import { PaginationResponseData } from '@/types/pagination';
import { ulid } from 'ulid';
import { RoleService } from '@/role/role.service';
import { AuthService } from '@/auth/auth.service';
@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly roleService: RoleService,
    private readonly authService: AuthService,
  ) {}

  async findOne(id: string): Promise<B2BClient> {
    const user = await this.prisma.b2BClient.findUnique({
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

  async findAll(
    queryDto: PaginationRequestDto,
  ): Promise<PaginationResponseData<B2BClient>> {
    const {
      limit = 10,
      skip = 0,
      sort = 'createdAt:desc',
      search = '',
    } = queryDto;

    const [sortField, sortOrder] = sort.split(':');

    const where: Prisma.B2BClientWhereInput = search
      ? {
          OR: [
            {
              firstName: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              lastName: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      this.prisma.b2BClient.findMany({
        take: limit,
        skip: skip,
        where,
        include: {
          account: {
            include: {
              role: true,
            },
          },
        },
        orderBy: {
          [sortField]: sortOrder === 'asc' ? 'asc' : 'desc',
        },
      }),
      this.prisma.b2BClient.count({ where }),
    ]);

    return {
      filters: {
        skip,
        limit,
        search,
        total,
        received: users.length,
      },
      data: users,
    };
  }

  async create(data: CreateUserDto): Promise<{ verifyToken: string }> {
    try {
      const { email, user } = data;

      // Отримуємо роль B2B_CLIENT
      const b2bRole = await this.roleService.getByName(RoleType.USER);

      // Створюємо акаунт з роллю
      const account = await this.prisma.account.create({
        data: {
          id: ulid(),
          email,
          roleId: b2bRole.id,
        },
      });

      await this.prisma.b2BClient.create({
        data: {
          id: ulid(),
          ...user,
          accountId: account.id,
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

  async update(id: string, data: UpdateUserDto): Promise<B2BClient> {
    try {
      return await this.prisma.b2BClient.update({
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
      await this.prisma.b2BClient.delete({
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
