import { Module } from '@nestjs/common';
import { BeaconService } from './beacon.service';
import { BeaconController } from './beacon.controller';
import { UtilsModule } from '../utils/utils.module';
import { SpecsService } from '../specs/specs.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Spec } from '../specs/entities/spec.entity';

@Module({
  imports: [UtilsModule, SequelizeModule.forFeature([Spec])],
  controllers: [BeaconController],
  providers: [BeaconService, SpecsService],
})
export class BeaconModule {}
