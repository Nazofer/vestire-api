import { ApiProperty } from '@nestjs/swagger';
import { HourRates as HourRatesPrisma } from '@prisma/client';

export class HourRates implements HourRatesPrisma {
  @ApiProperty({ description: 'id' })
  id: string;

  @ApiProperty({ description: 'type' })
  type: string;

  @ApiProperty({ description: 'monday', required: false })
  monday: number | null;

  @ApiProperty({ description: 'tuesday', required: false })
  tuesday: number | null;

  @ApiProperty({ description: 'wednesday', required: false })
  wednesday: number | null;

  @ApiProperty({ description: 'thursday', required: false })
  thursday: number | null;

  @ApiProperty({ description: 'friday', required: false })
  friday: number | null;

  @ApiProperty({ description: 'saturday', required: false })
  saturday: number | null;

  @ApiProperty({ description: 'sunday', required: false })
  sunday: number | null;

  @ApiProperty({ description: 'updatedAt', required: false })
  updatedAt: Date | null;
}
