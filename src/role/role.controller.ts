import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Delete,
  Get,
  Patch,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleType } from '@prisma/client';

@Controller('roles')
@UseGuards(AuthGuard('jwt'))
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  createRole(
    @Body() data: { type: RoleType; name: string; description?: string },
  ) {
    return this.roleService.createRole(data);
  }

  @Get()
  getRoles() {
    return this.roleService.getRoles();
  }

  @Get(':id')
  getRole(@Param('id') id: string) {
    return this.roleService.getRole(id);
  }

  @Patch(':id')
  updateRole(
    @Param('id') id: string,
    @Body() data: { name?: string; description?: string },
  ) {
    return this.roleService.updateRole(id, data);
  }

  @Delete(':id')
  deleteRole(@Param('id') id: string) {
    return this.roleService.deleteRole(id);
  }

  @Post(':roleId/accounts/:accountId')
  assignRoleToAccount(
    @Param('roleId') roleId: string,
    @Param('accountId') accountId: string,
  ) {
    return this.roleService.assignRoleToAccount(accountId, roleId);
  }

  @Post(':roleId/permissions')
  createPermission(
    @Param('roleId') roleId: string,
    @Body() data: { action: string; subject: string },
  ) {
    return this.roleService.createPermission(roleId, data);
  }

  @Get(':roleId/permissions')
  getPermissions(@Param('roleId') roleId: string) {
    return this.roleService.getPermissions(roleId);
  }

  @Delete(':roleId/permissions/:permissionId')
  removePermissionFromRole(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.roleService.removePermissionFromRole(roleId, permissionId);
  }
}
