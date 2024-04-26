import { Module } from '@nestjs/common';
import { BeaconService } from './beacon.service';
import { BeaconController } from './beacon.controller';
import { UtilsModule } from '../utils/utils.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Spec } from './entities/spec.entity';

@Module({
  imports: [UtilsModule, SequelizeModule.forFeature([Spec])],
  controllers: [BeaconController],
  providers: [BeaconService],
})
export class BeaconModule {}
