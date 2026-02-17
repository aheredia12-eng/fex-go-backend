import { Tenant } from '../../domain/entities/tenant.entity';

export class TenantPrismaMapper {
  static toDomain(raw: any): Tenant {
    return new Tenant({
      id: raw.id,
      name: raw.name,
      code: raw.code,
      status: raw.status,
      settings: (raw.settings ?? {}) as Record<string, unknown>,
      metadata: (raw.metadata ?? undefined) as Record<string, unknown> | undefined,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      isDeleted: raw.isDeleted,
    });
  }
}
