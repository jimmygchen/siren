import { Module } from '@nestjs/common';
import { UtilsModule } from '../utils/utils.module';
import { TasksService } from './tasks.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Spec } from '../beacon/entities/spec.entity';
import { Validator } from '../validator/entities/validator.entity';
import { Metric } from '../validator/entities/metric.entity';

@Module({
  imports: [UtilsModule, SequelizeModule.forFeature([Spec, Validator, Metric])],
  providers: [TasksService],
})
export class TasksModule {}
