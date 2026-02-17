import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AUTH_REPOSITORY, AuthRepository } from '../../domain/repositories/auth.repository';
import { TokenService } from '../../domain/services/token.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @Inject(AUTH_REPOSITORY) private readonly authRepository: AuthRepository,
    private readonly tokenService: TokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'dev-secret'),
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: { sub: string; tenantId: string; email: string }) {
    const token = req?.headers?.authorization?.replace('Bearer ', '') ?? '';
    const session = await this.authRepository.findSessionByTokenHash(this.tokenService.sha256(token));
    if (!session || session.revokedAt || session.expiresAt <= new Date()) {
      throw new UnauthorizedException('Session expired');
    }
    return payload;
  }
}
