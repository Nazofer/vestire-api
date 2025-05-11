import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, RoleType } from '@prisma/client';
import { ulid } from 'ulid';
import RoleDto from './dto/create-role.dto';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Role[]> {
    return await this.prisma.role.findMany({
      include: {
        permissions: true,
      },
    });
  }

  async getByName(name: string): Promise<Role> {
    const role = await this.prisma.role.findUnique({
      where: { name: name as RoleType },
      include: {
        permissions: true,
      },
    });

    if (!role) {
      throw new ConflictException('A role with the given name does not exist');
    }

    return role;
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        permissions: true,
      },
    });

    if (!role) {
      throw new ConflictException('A role with the given id does not exist');
    }

    return role;
  }

  async create(roleDto: RoleDto): Promise<Role> {
    return await this.prisma.role.create({
      data: {
        id: ulid(),
        name: roleDto.name,
      },
      include: {
        permissions: true,
      },
    });
  }

  async update(id: string, roleDto: Partial<RoleDto>): Promise<Role> {
    await this.findOne(id);

    return await this.prisma.role.update({
      where: { id },
      data: {
        name: roleDto.name,
      },
      include: {
        permissions: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id);

    try {
      await this.prisma.role.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException('Failed to delete role');
    }
  }
}
