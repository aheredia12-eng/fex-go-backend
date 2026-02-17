import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRED_PERMISSION_KEY } from '../decorators/require-permission.decorator';
import { AuthorizationService } from 'src/modules/security/domain/services/authorization.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authorizationService: AuthorizationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requirement = this.reflector.getAllAndOverride<{ resource: string; action: string }>(
      REQUIRED_PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requirement) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as { sub: string; tenantId: string };
    const allowed = await this.authorizationService.validatePermission(
      user.sub,
      user.tenantId,
      requirement.resource,
      requirement.action,
    );

    if (!allowed) throw new ForbiddenException('Permission denied');
    return true;
  }
}
