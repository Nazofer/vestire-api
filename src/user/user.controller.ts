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
import { PaginationRequestDto } from './dto/query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { AbilitiesGuard } from '@/role/guards/abilities.guard';
import { CheckAbilities } from '@/role/decorators/abilities.decorator';

@Controller('users')
@UseGuards(AuthGuard('jwt'), AbilitiesGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @CheckAbilities({ action: 'manage', subject: 'user' })
  findAll(@Query() queryDto: PaginationRequestDto) {
    return this.userService.findAll(queryDto);
  }

  @Post()
  @CheckAbilities({ action: 'manage', subject: 'user' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  @CheckAbilities({ action: 'manage', subject: 'user' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @CheckAbilities({ action: 'manage', subject: 'user', conditions: true })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @CheckAbilities({ action: 'manage', subject: 'user', conditions: true })
  delete(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
