import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiFoundResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';

import { PaginationRequestDto } from '@/types/pagination';
import { CheckAbilities } from '@/role/decorators/abilities.decorator';
import { AbilitiesGuard } from '@/role/guards/abilities.guard';
import { Equipment } from './entities/equipment.entity';
import FindAllEquipmentDto from './dto/find-all-equipment.dto';

@ApiTags('Обладнання')
@ApiBearerAuth()
@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @CheckAbilities({ action: 'create', subject: 'equipment' })
  @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
  @ApiOperation({
    summary: 'Створити нове обладнання',
  })
  @ApiCreatedResponse({
    description: 'A new equipment has been created successfully',
    type: Equipment,
  })
  @Post()
  create(@Body() createEquipmentDto: CreateEquipmentDto) {
    return this.equipmentService.create(createEquipmentDto);
  }

  @CheckAbilities({ action: 'manage', subject: 'equipment' })
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all equipment in the system' })
  @ApiFoundResponse({
    description: 'All equipment have been received',
    type: FindAllEquipmentDto,
  })
  @Get()
  findAll(@Query() queryDto: PaginationRequestDto) {
    return this.equipmentService.findAll(queryDto);
  }

  @CheckAbilities({ action: 'manage', subject: 'equipment', conditions: true })
  @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
  @ApiOperation({ summary: 'Get equipment by its id' })
  @ApiFoundResponse({
    description: 'The equipment has been received',
    type: Equipment,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.equipmentService.findOne(id);
  }

  @CheckAbilities({ action: 'manage', subject: 'equipment', conditions: true })
  @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
  @ApiOperation({ summary: 'Update equipment by its id' })
  @ApiFoundResponse({
    description: 'The equipment has been updated',
    type: Equipment,
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEquipmentDto: UpdateEquipmentDto,
  ) {
    return this.equipmentService.update(id, updateEquipmentDto);
  }

  @CheckAbilities({ action: 'manage', subject: 'equipment', conditions: true })
  @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
  @ApiOperation({ summary: 'Delete equipment by its id' })
  @ApiNoContentResponse({
    description: 'The equipment has been deleted successfully',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.equipmentService.remove(id);
  }
}
