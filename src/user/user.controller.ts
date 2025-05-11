import {
  Get,
  Body,
  Controller,
  Post,
  Query,
  Delete,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { AbilitiesGuard } from '@/role/guards/abilities.guard';
import { CheckAbilities } from '@/role/decorators/abilities.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { PaginationRequestDto } from '@/types/pagination';
import FindAllUsersDto from './dto/find-all-users.dto';
import { User } from './entities/user.entity';

@ApiTags('Користувачі')
@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthGuard('jwt'), AbilitiesGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати список користувачів' })
  @ApiResponse({
    status: 200,
    description: 'Список користувачів успішно отримано',
    type: FindAllUsersDto,
  })
  @CheckAbilities({ action: 'manage', subject: 'user' })
  findAll(@Query() queryDto: PaginationRequestDto) {
    return this.userService.findAll(queryDto);
  }

  @Post()
  @ApiOperation({ summary: 'Створити нового користувача' })
  @ApiResponse({
    status: 201,
    description: 'Користувача успішно створено',
    type: User,
  })
  @CheckAbilities({ action: 'create', subject: 'user' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати користувача за ID' })
  @ApiParam({ name: 'id', description: 'ID користувача' })
  @ApiResponse({
    status: 200,
    description: 'Користувача успішно знайдено',
    type: User,
  })
  @CheckAbilities({ action: 'manage', subject: 'user', conditions: true })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити користувача' })
  @ApiParam({ name: 'id', description: 'ID користувача' })
  @ApiResponse({
    status: 200,
    description: 'Користувача успішно оновлено',
    type: User,
  })
  @CheckAbilities({ action: 'manage', subject: 'user', conditions: true })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити користувача' })
  @ApiParam({ name: 'id', description: 'ID користувача' })
  @ApiResponse({
    status: 200,
    description: 'Користувача успішно видалено',
  })
  @CheckAbilities({ action: 'manage', subject: 'user', conditions: true })
  delete(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
