import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { CreateTenantDto } from '../../application/dto/create-tenant.dto';
import { UpdateTenantDto } from '../../application/dto/update-tenant.dto';
import { CreateTenantUseCase } from '../../application/use-cases/create-tenant.use-case';
import { DeleteTenantUseCase } from '../../application/use-cases/delete-tenant.use-case';
import { GetTenantUseCase } from '../../application/use-cases/get-tenant.use-case';
import { ListTenantsUseCase } from '../../application/use-cases/list-tenants.use-case';
import { UpdateTenantUseCase } from '../../application/use-cases/update-tenant.use-case';

@Controller('tenants')
@UseGuards(JwtAuthGuard)
export class TenantsController {
  constructor(
    private readonly createTenantUseCase: CreateTenantUseCase,
    private readonly listTenantsUseCase: ListTenantsUseCase,
    private readonly getTenantUseCase: GetTenantUseCase,
    private readonly updateTenantUseCase: UpdateTenantUseCase,
    private readonly deleteTenantUseCase: DeleteTenantUseCase,
  ) {}

  @Post()
  create(@Body() dto: CreateTenantDto) {
    return this.createTenantUseCase.execute(dto);
  }

  @Get()
  list() {
    return this.listTenantsUseCase.execute();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.getTenantUseCase.execute(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTenantDto) {
    return this.updateTenantUseCase.execute(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteTenantUseCase.execute(id);
  }
}
