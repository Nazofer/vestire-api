import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
  Req,
} from '@nestjs/common';
import { ManagerService } from './manager.service';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { AuthGuard } from '@nestjs/passport';
import { Manager } from './entities/manager.entity';
import { AbilitiesGuard } from '@/role/guards/abilities.guard';
import { CheckAbilities } from '@/role/decorators/abilities.decorator';
import { RequestWithUser } from '@/auth/types/jwt-payload.interface';

@ApiTags('Manager')
@ApiBearerAuth()
@Controller('manager')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @CheckAbilities({ action: 'create', subject: 'manager' })
  @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
  @ApiOperation({ summary: 'Create a new manager in the system' })
  @ApiCreatedResponse({
    description: 'A manager has been created successfully',
    type: Manager,
  })
  @Post()
  create(
    @Request() req: RequestWithUser,
    @Body() createManagerDto: CreateManagerDto,
  ) {
    return this.managerService.create(req.user, createManagerDto);
  }

  @CheckAbilities({ action: 'manage', subject: 'manager' })
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all managers in the system' })
  @ApiOkResponse({
    description: 'All managers have been received',
    type: [Manager],
  })
  @Get()
  findAll(@Req() req: RequestWithUser) {
    return this.managerService.findAll(req.user);
  }

  @CheckAbilities({ action: 'manage', subject: 'manager', conditions: true })
  @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
  @ApiOperation({ summary: 'Get a manager by its id' })
  @ApiOkResponse({
    description: 'The manager has been received',
    type: Manager,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.managerService.findOne(id);
  }

  @CheckAbilities({ action: 'manage', subject: 'manager', conditions: true })
  @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
  @ApiOperation({ summary: 'Update a manager by its id' })
  @ApiOkResponse({
    description: 'The manager has been updated successfully',
    type: Manager,
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateManagerDto: UpdateManagerDto) {
    return this.managerService.update(id, updateManagerDto);
  }

  @CheckAbilities({ action: 'manage', subject: 'manager', conditions: true })
  @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
  @ApiOperation({ summary: 'Delete a manager by its id' })
  @ApiNoContentResponse({
    description: 'The manager has been deleted successfully',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.managerService.remove(id);
  }
}
