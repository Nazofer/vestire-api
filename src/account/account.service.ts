import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Account, AccountStatus, RoleType } from '@prisma/client';
import { UpdateAccountDto } from './dto/update.account.dto';
import * as bcrypt from 'bcrypt';
import { ulid } from 'ulid';
import { RoleService } from '@/role/role.service';

@Injectable()
export class AccountService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly roleService: RoleService,
  ) {}

  async getCount(): Promise<number> {
    return await this.prisma.account.count();
  }

  async findOne(id: string): Promise<Account | null> {
    return await this.prisma.account.findUnique({
      where: { id },
    });
  }

  async checkEmail(email: string): Promise<void> {
    const account = await this.prisma.account.findUnique({
      where: { email },
    });

    if (account) {
      throw new ConflictException(
        'An account with the given email already exists',
      );
    }
  }

  async createSuperUserAccount(
    email: string,
    password: string,
  ): Promise<Account> {
    const adminRole = await this.roleService.getByName(RoleType.ADMIN);

    return await this.prisma.account.create({
      data: {
        id: ulid(),
        email,
        password: await bcrypt.hash(password, 10),
        status: AccountStatus.ACTIVE,
        roleId: adminRole.id,
      },
    });
  }

  async getAccount({
    id,
    email,
  }: {
    id?: string;
    email?: string;
  }): Promise<Account> {
    if (!id && !email) {
      throw new ConflictException('Either id or email must be provided');
    }

    const account = await this.prisma.account.findFirst({
      where: {
        OR: [{ id }, { email }],
      },
      include: {
        user: true,
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    if (!account) {
      throw new ConflictException(
        'An account with the given properties does not exist',
      );
    }

    return account;
  }

  async update(
    id: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    await this.findOne(id);

    return await this.prisma.account.update({
      where: { id },
      data: updateAccountDto,
    });
  }
}
