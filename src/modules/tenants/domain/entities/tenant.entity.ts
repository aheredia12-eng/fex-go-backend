export type TenantStatus = 'active' | 'inactive' | 'suspended';

export interface TenantProps {
  id: string;
  name: string;
  code: string;
  status: TenantStatus;
  settings: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export class Tenant {
  constructor(private readonly props: TenantProps) {}

  static create(input: Omit<TenantProps, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'> & { id: string }): Tenant {
    return new Tenant({
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    });
  }

  toPrimitives(): TenantProps {
    return { ...this.props };
  }
}
