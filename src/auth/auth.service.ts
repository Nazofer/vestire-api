import * as bcrypt from 'bcrypt';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import SignInDTO from './dto/signin.dto';
import AuthDto from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Account, AccountStatus } from '@prisma/client';
import { AccountService } from '@/account/account.service';
import ConfirmPasswordDto from './dto/confirm-password.dto';
import { JwtPayload } from './types/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
  ) {}

  async login(signInDTO: SignInDTO): Promise<AuthDto> {
    const { email, password } = signInDTO;
    const numberOfAccounts = await this.accountService.getCount();

    if (!numberOfAccounts) {
      await this.accountService.createSuperUserAccount(email, password);
    }

    const account: Account = await this.accountService.getAccount({
      email,
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.status !== AccountStatus.ACTIVE || !account.password) {
      throw new ForbiddenException('Account is not active');
    }

    if (!(await bcrypt.compare(password, account.password))) {
      throw new UnauthorizedException('Wrong password');
    }

    const payload: JwtPayload = {
      id: account.id,
      email: account.email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.generateToken(payload, process.env.SECRET, 60 * 15),
      this.generateToken(
        payload,
        process.env.REFRESH_SECRET,
        60 * 60 * 24 * 15,
      ),
    ]);

    delete account.password;

    return { accessToken, refreshToken, account };
  }

  private async generateToken(
    payload: JwtPayload,
    secret: string,
    expiresIn: number,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });
  }

  async generateVerifyToken(payload: JwtPayload): Promise<string> {
    return this.generateToken(payload, process.env.VERIFY_SECRET, 60 * 60);
  }

  async confirmPassword(confirmPasswordDto: ConfirmPasswordDto): Promise<void> {
    const { id, password } = confirmPasswordDto;
    const account = await this.accountService.findOne(id);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.accountService.update(id, { password: hashedPassword });
  }

  async getAccount(id: string): Promise<Account> {
    const account = await this.accountService.findOne(id);
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return account;
  }

  async verify(body: ConfirmPasswordDto, payload: JwtPayload) {
    const account = await this.accountService.findOne(payload.id);
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const hashedPass = await bcrypt.hash(body.password, 10);
    const updatedAccount = await this.accountService.update(payload.id, {
      password: hashedPass,
      status: AccountStatus.ACTIVE,
    });

    const [accessToken, refreshToken] = await Promise.all([
      this.generateToken(payload, process.env.SECRET, 60 * 15),
      this.generateToken(payload, process.env.REFRESH_SECRET, 60 * 60),
    ]);

    delete updatedAccount.password;

    return { accessToken, refreshToken, account: updatedAccount };
  }

  async refresh(payload: JwtPayload): Promise<AuthDto> {
    const account = await this.accountService.findOne(payload.id);
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.generateToken(payload, process.env.SECRET, 60 * 15),
      this.generateToken(
        payload,
        process.env.REFRESH_SECRET,
        60 * 60 * 24 * 15,
      ),
    ]);

    delete account.password;
    return { accessToken, refreshToken, account };
  }
}
