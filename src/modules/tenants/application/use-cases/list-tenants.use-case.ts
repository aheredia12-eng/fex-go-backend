import { Inject, Injectable } from '@nestjs/common';
import { TENANT_REPOSITORY, TenantRepository } from '../../domain/repositories/tenant.repository';

@Injectable()
export class ListTenantsUseCase {
  constructor(@Inject(TENANT_REPOSITORY) private readonly tenantRepository: TenantRepository) {}

  execute() {
    return this.tenantRepository.findAll();
  }
}
