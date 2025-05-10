import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../types/jwt-payload.interface';

@Injectable()
export class RstStrategy extends PassportStrategy(Strategy, 'jwt-reset') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.RESET_SECRET,
    });
  }

  validate(payload: JwtPayload) {
    delete payload.exp;
    delete payload.iat;
    return payload;
  }
}
