import { Module } from '@nestjs/common';
import { BeaconService } from './beacon.service';
import { BeaconController } from './beacon.controller';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [UtilsModule],
  controllers: [BeaconController],
  providers: [BeaconService],
})
export class BeaconModule {}
