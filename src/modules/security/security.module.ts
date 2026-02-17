import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AUTH_REPOSITORY } from './domain/repositories/auth.repository';
import { AuthorizationService } from './domain/services/authorization.service';
import { PasswordService } from './domain/services/password.service';
import { TokenService } from './domain/services/token.service';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { PrismaAuthRepository } from './infra/repositories/prisma-auth.repository';
import { JwtStrategy } from './infra/strategies/jwt.strategy';
import { AuthController } from './infra/controllers/auth.controller';
import { PermissionsGuard } from 'src/shared/guards/permissions.guard';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'dev-secret'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN', '1h') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    PasswordService,
    TokenService,
    AuthorizationService,
    JwtStrategy,
    PermissionsGuard,
    { provide: AUTH_REPOSITORY, useClass: PrismaAuthRepository },
  ],
  exports: [AuthorizationService],
})
export class SecurityModule {}
