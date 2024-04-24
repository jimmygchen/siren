import { Module } from '@nestjs/common';
import { ValidatorController } from './validator.controller';
import { ValidatorService } from './validator.service';
import { UtilsModule } from '../utils/utils.module';
import { ValidatorDetailService } from './validator-detail.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Validator } from './entities/validator.entity';
import { SpecsService } from '../specs/specs.service';
import { Spec } from '../specs/entities/spec.entity';

@Module({
  imports: [UtilsModule, SequelizeModule.forFeature([Validator, Spec])],
  controllers: [ValidatorController],
  providers: [ValidatorService, ValidatorDetailService, SpecsService],
})
export class ValidatorModule {}
