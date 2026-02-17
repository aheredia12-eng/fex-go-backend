import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateTenantDto } from '../dto/create-tenant.dto';
import { TENANT_REPOSITORY, TenantRepository } from '../../domain/repositories/tenant.repository';
import { Tenant } from '../../domain/entities/tenant.entity';

@Injectable()
export class CreateTenantUseCase {
  constructor(@Inject(TENANT_REPOSITORY) private readonly tenantRepository: TenantRepository) {}

  async execute(dto: CreateTenantDto) {
    const exists = await this.tenantRepository.findByCode(dto.code);
    if (exists) throw new BadRequestException('Tenant code already exists');

    const tenant = Tenant.create({
      id: randomUUID(),
      name: dto.name,
      code: dto.code,
      status: 'active',
      settings: dto.settings ?? {},
      metadata: dto.metadata,
    });

    return this.tenantRepository.create(tenant);
  }
}
