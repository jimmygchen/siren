import { Module } from '@nestjs/common';
import { SpecsService } from './specs.service';
import { SpecsController } from './specs.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Spec } from './entities/spec.entity';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [UtilsModule, SequelizeModule.forFeature([Spec])],
  controllers: [SpecsController],
  providers: [SpecsService],
})
export class SpecsModule {}
