import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTenantDto } from '../dto/update-tenant.dto';
import { TENANT_REPOSITORY, TenantRepository } from '../../domain/repositories/tenant.repository';

@Injectable()
export class UpdateTenantUseCase {
  constructor(@Inject(TENANT_REPOSITORY) private readonly tenantRepository: TenantRepository) {}

  async execute(id: string, dto: UpdateTenantDto) {
    const tenant = await this.tenantRepository.update(id, dto);
    if (!tenant) throw new NotFoundException('Tenant not found');
    return tenant;
  }
}
