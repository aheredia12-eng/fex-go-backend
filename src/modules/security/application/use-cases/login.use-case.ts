import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AUTH_REPOSITORY, AuthRepository } from '../../domain/repositories/auth.repository';
import { PasswordService } from '../../domain/services/password.service';
import { TokenService } from '../../domain/services/token.service';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly authRepository: AuthRepository,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
  ) {}

  async execute(dto: LoginDto, context: { ipAddress?: string; userAgent?: string }) {
    const actor = await this.authRepository.findActorByTenantAndEmail(dto.tenantCode, dto.email);
    if (!actor?.passwordHash) throw new UnauthorizedException('Invalid credentials');
    if (actor.status !== 'active') throw new BadRequestException('Actor is not active');

    const valid = await this.passwordService.verify(dto.password, actor.passwordHash);
    if (!valid) {
      await this.authRepository.logSecurityEvent({
        tenantId: actor.tenantId,
        actorId: actor.id,
        eventType: 'AUTH_LOGIN_FAILED',
        result: 'failed',
        resource: 'auth',
        action: 'login',
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: actor.id, tenantId: actor.tenantId, email: actor.email };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, { expiresIn: '30d' });

    const session = await this.authRepository.createSession({
      actorId: actor.id,
      tenantId: actor.tenantId,
      tokenHash: this.tokenService.sha256(accessToken),
      refreshTokenHash: this.tokenService.sha256(refreshToken),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    });

    await this.authRepository.logSecurityEvent({
      tenantId: actor.tenantId,
      actorId: actor.id,
      sessionId: session.id,
      eventType: 'AUTH_LOGIN_SUCCESS',
      result: 'success',
      resource: 'auth',
      action: 'login',
    });

    return { accessToken, refreshToken, expiresAt: session.expiresAt };
  }
}
