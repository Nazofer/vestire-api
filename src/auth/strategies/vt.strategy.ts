import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../types/jwt-payload.interface';
import { PrismaService } from '@/prisma/prisma.service';
@Injectable()
export class VtStrategy extends PassportStrategy(Strategy, 'jwt-verify') {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.VERIFY_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    const account = await this.prisma.account.findUnique({
      where: { id: payload.id },
      include: {
        role: true,
        owner: true,
        manager: true,
      },
    });

    if (!account) {
      throw new UnauthorizedException('Account not found');
    }

    delete account.password;

    return {
      ...payload,
      account,
    };
  }
}
