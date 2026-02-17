export const AUTH_REPOSITORY = Symbol('AUTH_REPOSITORY');

export interface AuthRepository {
  findActorByTenantAndEmail(tenantCode: string, email: string): Promise<{ id: string; tenantId: string; email: string | null; passwordHash: string | null; status: string } | null>;
  createSession(input: { tenantId: string; actorId: string; tokenHash: string; refreshTokenHash?: string | null; expiresAt: Date; ipAddress?: string; userAgent?: string }): Promise<{ id: string; expiresAt: Date }>;
  logSecurityEvent(input: { tenantId: string; actorId?: string; sessionId?: string; eventType: string; result: string; resource?: string; action?: string; details?: Record<string, unknown> }): Promise<void>;
  getPermissions(actorId: string, tenantId: string): Promise<Array<{ resource: string; action: string; effect: 'allow' | 'deny'; priority: number }>>;
  findSessionByTokenHash(tokenHash: string): Promise<{ id: string; revokedAt: Date | null; expiresAt: Date } | null>;
}
