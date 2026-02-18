import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TENANT_REPOSITORY, TenantRepository } from '../../domain/repositories/tenant.repository';

@Injectable()
export class DeleteTenantUseCase {
  constructor(@Inject(TENANT_REPOSITORY) private readonly tenantRepository: TenantRepository) {}

  async execute(id: string) {
    const deleted = await this.tenantRepository.softDelete(id);
    if (!deleted) throw new NotFoundException('Tenant not found');
    return { deleted: true };
  }
}
