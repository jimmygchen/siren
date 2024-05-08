import { Module } from '@nestjs/common';
import { BeaconService } from './beacon.service';
import { BeaconController } from './beacon.controller';
import { UtilsModule } from '../utils/utils.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [UtilsModule, CacheModule.register()],
  controllers: [BeaconController],
  providers: [BeaconService],
})
export class BeaconModule {}
