import { HourRates } from '@/types/hour-rates';
import { ApiProperty } from '@nestjs/swagger';
import { Equipment as EquipmentPrisma, RentalObject } from '@prisma/client';

export class Equipment implements EquipmentPrisma {
  @ApiProperty({ description: 'id' })
  id: string;

  @ApiProperty({ description: 'name' })
  name: string;

  @ApiProperty({ description: 'description', required: false })
  description: string | null;

  @ApiProperty({ description: 'hourRateId' })
  hourRateId: string;

  @ApiProperty({
    description: 'rentalObjectId',
  })
  rentalObjectId: string;

  @ApiProperty({ description: 'imageUrl', required: false })
  imageUrl: string | null;

  @ApiProperty({ description: 'state', required: false })
  state: string | null;

  @ApiProperty({
    description: 'Hour rates information',
    type: () => HourRates,
    required: false,
  })
  HourRates?: HourRates;

  // @ApiProperty({
  //   description: 'Rental object information',
  //   type: () => RentalObject,
  //   required: false,
  // })
  // RentalObject?: RentalObject;
}
