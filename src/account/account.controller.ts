import { Controller, Get, Param, Put, Body, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { Account } from '@prisma/client';
import { UpdateAccountDto } from './dto/update.account.dto';
import { AuthGuard } from '@nestjs/passport';
import { checkAbilities, AbilitiesGuard } from '../auth/guards/abilities.guard';

@Controller('account')
@UseGuards(AuthGuard('jwt'), AbilitiesGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get(':id')
  @checkAbilities({ action: 'read', subject: 'profile' })
  async findOne(@Param('id') id: string): Promise<Account> {
    return this.accountService.findOne(id);
  }

  @Put(':id')
  @checkAbilities({ action: 'update', subject: 'profile' })
  async update(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    return this.accountService.update(id, updateAccountDto);
  }
}
