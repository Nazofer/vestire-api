import {
  Body,
  Request,
  Controller,
  Get,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import SignInDTO from './dto/signin.dto';
import { AuthGuard } from '@nestjs/passport';
import ConfirmPasswordDto from './dto/confirm-password.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import AuthDto from './dto/auth.dto';
import { RequestWithUser } from './types/jwt-payload.interface';
import { Account } from '@/account/entities/account.entity';

@ApiTags('Авторизація')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Вхід в систему' })
  @ApiResponse({
    status: 201,
    description: 'Успішний вхід в систему',
    type: AuthDto,
  })
  @HttpCode(HttpStatus.CREATED)
  login(@Body() signInDTO: SignInDTO) {
    return this.authService.login(signInDTO);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Оновлення токенів доступу' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Токени успішно оновлено',
    type: AuthDto,
  })
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.CREATED)
  refresh(@Request() req: RequestWithUser) {
    return this.authService.refresh(req.user);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Підтвердження облікового запису' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Обліковий запис успішно підтверджено',
    type: AuthDto,
  })
  @UseGuards(AuthGuard('jwt-verify'))
  @HttpCode(HttpStatus.CREATED)
  verify(
    @Body() confirmPasswordDto: ConfirmPasswordDto,
    @Request() req: RequestWithUser,
  ) {
    return this.authService.verify(confirmPasswordDto, req.user);
  }

  @Get('account')
  @ApiOperation({ summary: 'Отримання інформації про акаунт' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Інформацію про акаунт успішно отримано',
    type: Account,
  })
  @UseGuards(AuthGuard('jwt'))
  getAccount(@Request() req: RequestWithUser) {
    return this.authService.getAccount(req.user.id);
  }
}
