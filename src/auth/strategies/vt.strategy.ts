import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../types/jwt-payload.interface';

@Injectable()
export class VtStrategy extends PassportStrategy(Strategy, 'jwt-verify') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.VERIFY_SECRET,
    });
  }

  validate(payload: JwtPayload) {
    delete payload.exp;
    delete payload.iat;
    return payload;
  }
}
