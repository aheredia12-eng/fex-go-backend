import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InfraModule } from './infra/infra.module';
import { SecurityModule } from './modules/security/security.module';
import { TenantsModule } from './modules/tenants/tenants.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    InfraModule,
    SecurityModule,
    TenantsModule,
  ],
})
export class AppModule {}
