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
import { checkAbilities, AbilitiesGuard } from '../auth/guards/abilities.guard';

@Controller('users')
@UseGuards(AuthGuard('jwt'), AbilitiesGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @checkAbilities({ action: 'read', subject: 'profile' })
  findAll(@Query() queryDto: PaginationRequestDto) {
    return this.userService.findAll(queryDto);
  }

  @Post()
  @checkAbilities({ action: 'create', subject: 'profile' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  @checkAbilities({ action: 'read', subject: 'profile' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @checkAbilities({ action: 'update', subject: 'profile' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @checkAbilities({ action: 'delete', subject: 'profile' })
  delete(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
