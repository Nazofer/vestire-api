import { IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { Min } from 'class-validator';
import { IsNumber } from 'class-validator';
import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationRequestDto {
  @ApiProperty({
    description: 'limit',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    description: 'skip',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  skip?: number;

  @ApiProperty({
    description: 'sort',
    required: false,
  })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiProperty({
    description: 'search',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}

export class PaginationResponseDto {
  @ApiProperty({
    description: 'limit',
  })
  @IsNumber()
  @Type(() => Number)
  limit: number;

  @ApiProperty({
    description: 'skip',
  })
  @IsNumber()
  @Type(() => Number)
  skip: number;

  @ApiProperty({
    description: 'sort',
  })
  @IsString()
  sort: string;

  @ApiProperty({
    description: 'search',
  })
  @IsString()
  search: string;

  @ApiProperty({
    description: 'total',
  })
  @IsNumber()
  @Type(() => Number)
  total: number;

  @ApiProperty({
    description: 'received',
  })
  @IsNumber()
  @Type(() => Number)
  received: number;
}

export const DEFAULT_PAGINATION_REQUEST_DTO: PaginationRequestDto = {
  limit: 10,
  skip: 0,
  sort: 'createdAt:desc',
  search: '',
};
