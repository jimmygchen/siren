import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ValidatorService } from './validator.service';
import { AuthGuard } from '../auth.guard';

@Controller('validator')
@UseGuards(AuthGuard)
export class ValidatorController {
  constructor(private validatorService: ValidatorService) {}

  @Get('auth-key')
  async getValidatorAuth() {
    return this.validatorService.fetchValidatorAuthKey();
  }

  @Get('version')
  async getValidatorVersion() {
    return this.validatorService.fetchValidatorVersion();
  }

  @Get('states')
  async getValidatorStates() {
    return this.validatorService.fetchValidatorStates();
  }

  @Get('caches')
  async getValidatorCaches() {
    return this.validatorService.fetchValidatorCaches();
  }

  @UseGuards(AuthGuard)
  @Get('metrics')
  async getValidatorMetrics() {
    return this.validatorService.fetchMetrics();
  }

  @Get('metrics/:index')
  async getValidatorMetricsById(@Param('index') index: number) {
    return this.validatorService.fetchMetrics(index);
  }
}
