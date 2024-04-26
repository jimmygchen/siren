import { Controller, Get, Param } from '@nestjs/common';
import { ValidatorService } from './validator.service';

@Controller('validator')
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

  @Get('metrics')
  async getValidatorMetrics() {
    return this.validatorService.fetchMetrics();
  }

  @Get('metrics/:index')
  async getValidatorMetricsById(@Param('index') index: number) {
    return this.validatorService.fetchMetrics(index);
  }
}
