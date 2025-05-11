import {
  Body,
  Request,
  Controller,
  Get,
  Post,
  UseGuards,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import SignInDTO from './dto/signin.dto';
import { AuthGuard } from '@nestjs/passport';
import ConfirmPasswordDto from './dto/confirm-password.dto';
import { JwtPayload } from './types/jwt-payload.interface';

export interface RequestWithUser extends Request {
  user: JwtPayload;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  login(@Body() signInDTO: SignInDTO) {
    return this.authService.login(signInDTO);
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.CREATED)
  refresh(@Request() req: RequestWithUser) {
    return this.authService.refresh(req.user);
  }

  @Post('verify')
  @UseGuards(AuthGuard('jwt-verify'))
  @HttpCode(HttpStatus.CREATED)
  verify(
    @Body() confirmPasswordDto: ConfirmPasswordDto,
    @Request() req: RequestWithUser,
  ) {
    return this.authService.verify(confirmPasswordDto, req.user);
  }

  @Get('account/:id')
  @UseGuards(AuthGuard('jwt'))
  getAccount(@Param('id') id: string) {
    return this.authService.getAccount(id);
  }
}
