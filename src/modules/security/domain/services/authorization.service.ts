import { Inject, Injectable } from '@nestjs/common';
import { AUTH_REPOSITORY, AuthRepository } from '../repositories/auth.repository';

@Injectable()
export class AuthorizationService {
  constructor(@Inject(AUTH_REPOSITORY) private readonly authRepository: AuthRepository) {}

  async validatePermission(actorId: string, tenantId: string, resource: string, action: string): Promise<boolean> {
    const policies = await this.authRepository.getPermissions(actorId, tenantId);
    const matching = policies
      .filter((p) => p.resource === resource && p.action === action)
      .sort((a, b) => b.priority - a.priority);

    if (matching.length === 0) return false;
    return matching[0].effect === 'allow';
  }

  async validateStageAuthorization(actorId: string, tenantId: string, stageCode: string): Promise<boolean> {
    return this.validatePermission(actorId, tenantId, `stage:${stageCode}`, 'execute');
  }
}
