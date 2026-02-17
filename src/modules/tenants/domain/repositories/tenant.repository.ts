import { Tenant } from '../entities/tenant.entity';

export const TENANT_REPOSITORY = Symbol('TENANT_REPOSITORY');

export interface TenantRepository {
  create(tenant: Tenant): Promise<Tenant>;
  findById(id: string): Promise<Tenant | null>;
  findByCode(code: string): Promise<Tenant | null>;
  findAll(): Promise<Tenant[]>;
  update(id: string, input: Partial<{ name: string; status: 'active' | 'inactive' | 'suspended'; settings: Record<string, unknown>; metadata: Record<string, unknown> }>): Promise<Tenant | null>;
  softDelete(id: string): Promise<boolean>;
}
