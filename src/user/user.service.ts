import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Owner, Prisma, RoleType } from '@prisma/client';
import { PaginationRequestDto } from '@/types/pagination';
import { ulid } from 'ulid';
import { RoleService } from '@/role/role.service';
import { AuthService } from '@/auth/auth.service';
import { MailService } from '@/mail/mail.service';
import FindAllUsersDto from './dto/find-all-users.dto';
@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly roleService: RoleService,
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  async findOne(id: string): Promise<Owner> {
    const user = await this.prisma.owner.findUnique({
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

  async findAll(queryDto: PaginationRequestDto): Promise<FindAllUsersDto> {
    const { limit = 10, skip = 0, sort = 'id:desc', search = '' } = queryDto;

    const [sortField, sortOrder] = sort.split(':');

    const where: Prisma.OwnerWhereInput = search
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
      this.prisma.owner.findMany({
        take: Number(limit),
        skip: Number(skip),
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
      this.prisma.owner.count({ where }),
    ]);

    return {
      filters: {
        skip: Number(skip),
        limit: Number(limit),
        sort,
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
      console.log('data', data);

      const result = await this.prisma.$transaction(async (tx) => {
        const { id: roleId } = await this.roleService.getByName(RoleType.OWNER);

        // Create account with role
        const account = await tx.account.create({
          data: {
            id: ulid(),
            email,
            roleId,
          },
        });

        // Create owner with connection to the account
        const owner = await tx.owner.create({
          data: {
            id: ulid(),
            ...user,
            account: {
              connect: {
                id: account.id,
              },
            },
          },
        });

        // Generate verification token
        const verifyToken = await this.authService.generateVerifyToken({
          id: account.id,
          email: account.email,
        });

        return { account, owner, verifyToken };
      });

      // Send email after transaction completes successfully
      await this.mailService.sendMail({
        to: result.account.email,
        subject: 'Підтвердження електронної пошти',
        text: `Щоб підтвердити свій email, перейдіть за посиланням: http://127.0.0.1:8080/activate-account?verify_token=${result.verifyToken}`,
      });

      return { verifyToken: result.verifyToken };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Користувач з такими даними вже існує');
        }
      }
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async update(id: string, data: UpdateUserDto): Promise<Owner> {
    try {
      return await this.prisma.owner.update({
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
      await this.prisma.owner.delete({
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
