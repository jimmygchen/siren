import { Module } from '@nestjs/common';
import { ValidatorController } from './validator.controller';
import { ValidatorService } from './validator.service';
import { UtilsModule } from '../utils/utils.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Validator } from './entities/validator.entity';
import { Spec } from '../beacon/entities/spec.entity';

@Module({
  imports: [UtilsModule, SequelizeModule.forFeature([Validator, Spec])],
  controllers: [ValidatorController],
  providers: [ValidatorService],
})
export class ValidatorModule {}
