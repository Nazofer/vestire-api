import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationRequestDto } from '../types/pagination';
import { Equipment, Prisma } from '@prisma/client';
import { ulid } from 'ulid';
import FindAllEquipmentDto from './dto/find-all-equipment.dto';

@Injectable()
export class EquipmentService {
  constructor(private prisma: PrismaService) {}

  async create(createEquipmentDto: CreateEquipmentDto): Promise<Equipment> {
    const { name, description, price, rentalObjectId, imageUrl, state } =
      createEquipmentDto;

    // Use a transaction to ensure both records are created or none at all
    return this.prisma.$transaction(async (tx) => {
      // Create hour rates with the specified price
      const hourRates = await tx.hourRates.create({
        data: {
          id: ulid(),
          type: 'default',
          monday: price,
          tuesday: price,
          wednesday: price,
          thursday: price,
          friday: price,
          saturday: price,
          sunday: price,
        },
      });

      // Create equipment with the generated hour rates ID
      return tx.equipment.create({
        data: {
          id: ulid(),
          name,
          description,
          hourRateId: hourRates.id,
          rentalObjectId: rentalObjectId || 'default', // Provide a default or require in DTO
          imageUrl,
          state,
        },
        include: {
          HourRates: true,
          RentalObject: true,
        },
      });
    });
  }

  async findAll(
    paginationDto: PaginationRequestDto,
  ): Promise<FindAllEquipmentDto> {
    const {
      skip = 0,
      limit = 10,
      search = '',
      sort = 'name:asc', // Default sort changed to name since createdAt isn't in schema
    } = paginationDto;

    // Parse sort parameter
    const [sortField, sortOrder] = sort.split(':');
    const orderBy = { [sortField]: sortOrder === 'desc' ? 'desc' : 'asc' };

    // Build search criteria
    const where: Prisma.EquipmentWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    // Execute count and data fetch in parallel
    const [total, data] = await Promise.all([
      this.prisma.equipment.count({ where }),
      this.prisma.equipment.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          HourRates: true,
          RentalObject: true,
        },
      }),
    ]);

    return {
      filters: {
        skip,
        limit,
        sort,
        search,
        total,
        received: data.length,
      },
      data,
    };
  }

  async findOne(id: string): Promise<Equipment> {
    const equipment = await this.prisma.equipment.findUnique({
      where: { id },
      include: {
        HourRates: true,
        RentalObject: true,
      },
    });

    if (!equipment) {
      throw new NotFoundException(`Equipment with ID ${id} not found`);
    }

    return equipment;
  }

  async update(
    id: string,
    updateEquipmentDto: UpdateEquipmentDto,
  ): Promise<Equipment> {
    const equipment = await this.findOne(id);
    const { price, ...equipmentData } = updateEquipmentDto;

    return this.prisma.$transaction(async (tx) => {
      // Update hour rates if price is provided
      if (price !== undefined) {
        await tx.hourRates.update({
          where: { id: equipment.hourRateId },
          data: {
            monday: price,
            tuesday: price,
            wednesday: price,
            thursday: price,
            friday: price,
            saturday: price,
            sunday: price,
          },
        });
      }

      // Update equipment data
      return tx.equipment.update({
        where: { id },
        data: equipmentData,
        include: {
          HourRates: true,
          RentalObject: true,
        },
      });
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // Verify the equipment exists

    await this.prisma.equipment.delete({
      where: { id },
    });
  }
}
