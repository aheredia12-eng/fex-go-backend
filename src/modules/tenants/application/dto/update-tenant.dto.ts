import { IsIn, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateTenantDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsIn(['active', 'inactive', 'suspended'])
  status?: 'active' | 'inactive' | 'suspended';

  @IsOptional()
  @IsObject()
  settings?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
