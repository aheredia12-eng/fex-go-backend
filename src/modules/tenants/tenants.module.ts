import { Module } from '@nestjs/common';
import { TENANT_REPOSITORY } from './domain/repositories/tenant.repository';
import { CreateTenantUseCase } from './application/use-cases/create-tenant.use-case';
import { DeleteTenantUseCase } from './application/use-cases/delete-tenant.use-case';
import { GetTenantUseCase } from './application/use-cases/get-tenant.use-case';
import { ListTenantsUseCase } from './application/use-cases/list-tenants.use-case';
import { UpdateTenantUseCase } from './application/use-cases/update-tenant.use-case';
import { TenantsController } from './infra/controllers/tenants.controller';
import { PrismaTenantRepository } from './infra/repositories/prisma-tenant.repository';

@Module({
  controllers: [TenantsController],
  providers: [
    CreateTenantUseCase,
    DeleteTenantUseCase,
    GetTenantUseCase,
    ListTenantsUseCase,
    UpdateTenantUseCase,
    { provide: TENANT_REPOSITORY, useClass: PrismaTenantRepository },
  ],
})
export class TenantsModule {}
