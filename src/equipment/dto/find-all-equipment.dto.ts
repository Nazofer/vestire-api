import { PaginationResponseDto } from '@/types/pagination';
import { Prisma } from '@prisma/client';

export default class FindAllEquipmentDto {
  filters: PaginationResponseDto;
  data: Prisma.EquipmentGetPayload<{
    include: { HourRates: true; RentalObject: true };
  }>[];
}
