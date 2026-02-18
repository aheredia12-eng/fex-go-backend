import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Public } from 'src/shared/decorators/public.decorator';
import { RequirePermission } from 'src/shared/decorators/require-permission.decorator';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/shared/guards/permissions.guard';
import { LoginDto } from '../../application/dto/login.dto';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { AuthorizationService } from '../../domain/services/authorization.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly authorizationService: AuthorizationService,
  ) {}

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto, @Req() req: any) {
    return this.loginUseCase.execute(dto, {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('authorization', 'validate')
  @Post('permissions/check')
  async validatePermission(@Req() req: any) {
    const { actorId, tenantId, resource, action } = req.body;
    return {
      allowed: await this.authorizationService.validatePermission(actorId, tenantId, resource, action),
    };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('engine-stage', 'validate')
  @Post('engine/stage-authorization')
  async validateEngineStage(@Req() req: any) {
    const { actorId, tenantId, stageCode } = req.body;
    return {
      allowed: await this.authorizationService.validateStageAuthorization(actorId, tenantId, stageCode),
    };
  }
}
