import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { Tenant } from '../../domain/entities/tenant.entity';
import { TenantRepository } from '../../domain/repositories/tenant.repository';
import { TenantPrismaMapper } from '../mappers/tenant-prisma.mapper';

@Injectable()
export class PrismaTenantRepository implements TenantRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenant: Tenant): Promise<Tenant> {
    const data = tenant.toPrimitives();
    const created = await this.prisma.tenant.create({
      data: {
        id: data.id,
        name: data.name,
        code: data.code,
        status: data.status,
        settings: data.settings,
        metadata: data.metadata,
      },
    });
    return TenantPrismaMapper.toDomain(created);
  }

  async findById(id: string): Promise<Tenant | null> {
    const row = await this.prisma.tenant.findFirst({ where: { id, isDeleted: false } });
    return row ? TenantPrismaMapper.toDomain(row) : null;
  }

  async findByCode(code: string): Promise<Tenant | null> {
    const row = await this.prisma.tenant.findFirst({ where: { code, isDeleted: false } });
    return row ? TenantPrismaMapper.toDomain(row) : null;
  }

  async findAll(): Promise<Tenant[]> {
    const rows = await this.prisma.tenant.findMany({ where: { isDeleted: false }, orderBy: { createdAt: 'desc' } });
    return rows.map(TenantPrismaMapper.toDomain);
  }

  async update(id: string, input: any): Promise<Tenant | null> {
    const exists = await this.prisma.tenant.findFirst({ where: { id, isDeleted: false } });
    if (!exists) return null;
    const updated = await this.prisma.tenant.update({ where: { id }, data: { ...input } });
    return TenantPrismaMapper.toDomain(updated);
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.prisma.tenant.updateMany({
      where: { id, isDeleted: false },
      data: { isDeleted: true, deletedAt: new Date(), status: 'inactive' },
    });
    return result.count > 0;
  }
}
