import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { AuthRepository } from '../../domain/repositories/auth.repository';

@Injectable()
export class PrismaAuthRepository implements AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  findActorByTenantAndEmail(tenantCode: string, email: string) {
    return this.prisma.actor.findFirst({
      where: {
        email,
        isDeleted: false,
        tenant: { code: tenantCode, isDeleted: false },
      },
      select: { id: true, tenantId: true, email: true, passwordHash: true, status: true },
    });
  }

  createSession(input: any) {
    return this.prisma.session.create({
      data: {
        tenantId: input.tenantId,
        actorId: input.actorId,
        tokenHash: input.tokenHash,
        refreshTokenHash: input.refreshTokenHash,
        expiresAt: input.expiresAt,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      },
      select: { id: true, expiresAt: true },
    });
  }

  async logSecurityEvent(input: any) {
    await this.prisma.securityEventLog.create({
      data: {
        tenantId: input.tenantId,
        actorId: input.actorId,
        sessionId: input.sessionId,
        eventType: input.eventType,
        result: input.result,
        resource: input.resource,
        action: input.action,
        details: input.details,
      },
    });
  }

  async getPermissions(actorId: string, tenantId: string) {
    const rows = await this.prisma.permissionPolicy.findMany({
      where: {
        tenantId,
        isDeleted: false,
        role: {
          actorRoles: {
            some: {
              actorId,
              tenantId,
              OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
            },
          },
        },
      },
      select: { resource: true, action: true, effect: true, priority: true },
    });

    return rows as Array<{ resource: string; action: string; effect: 'allow' | 'deny'; priority: number }>;
  }

  findSessionByTokenHash(tokenHash: string) {
    return this.prisma.session.findFirst({ where: { tokenHash }, select: { id: true, revokedAt: true, expiresAt: true } });
  }
}
