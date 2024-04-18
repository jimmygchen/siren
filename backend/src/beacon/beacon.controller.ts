import { Controller, Get } from '@nestjs/common';
import { BeaconService } from './beacon.service';

@Controller('beacon')
export class BeaconController {
  constructor(private beaconService: BeaconService) {}

  @Get('spec')
  async getBeaconSpec() {
    return this.beaconService.fetchBeaconSpec()
  }

  @Get('node-version')
  async getBeaconNodeVersion() {
    return this.beaconService.fetchBeaconNodeVersion();
  }

  @Get('genesis')
  async getNodeGenesis() {
    return this.beaconService.fetchGenesisData();
  }

  @Get('sync')
  async getSyncData() {
    return this.beaconService.fetchSyncData();
  }

  @Get('inclusion')
  async getInclusionData() {
    return this.beaconService.fetchInclusionRate();
  }

  @Get('peer')
  async getPeerData() {
    return this.beaconService.fetchPeerData();
  }

  @Get('validator-count')
  async getValidatorCount() {
    return this.beaconService.fetchValidatorCount();
  }
}
