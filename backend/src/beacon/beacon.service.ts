import { Injectable } from '@nestjs/common';
import { UtilsService } from '../utils/utils.service';
import { throwServerError } from '../utilities';
import getPercentage from '../../../utilities/getPercentage';
import getStatus from '../../../utilities/getInclusionRateStatus';

@Injectable()
export class BeaconService {
  constructor(private utilsService: UtilsService) {}
  private beaconUrl = process.env.BEACON_URL;

  async fetchBeaconSpec () {
    try {
      const { data } = await this.utilsService.sendHttpRequest({url: `${this.beaconUrl}/eth/v1/config/spec`})
      return data.data
    } catch (e) {
      console.error(e)
      throwServerError('Unable to fetch beacon spec')
    }
  }

  async fetchBeaconNodeVersion () {
    try {

      const {data} = await this.utilsService.sendHttpRequest({url: `${this.beaconUrl}/eth/v1/node/version`});
      return data.data;

    } catch (e) {
      console.error(e)
      throwServerError('Unable to fetch beacon node version')
    }
  }

  async fetchGenesisData () {
    try {
      const {data} = await this.utilsService.sendHttpRequest({url: `${this.beaconUrl}/eth/v1/beacon/genesis`})
      return data.data
    } catch (e) {
      console.error(e)
      throwServerError('Unable to fetch beacon node version')
    }
  }

  async fetchSyncData() {
    try {
      const [beaconSpec, beaconResponse, executionResponse] = await Promise.all([
        this.utilsService.sendHttpRequest({url: `${this.beaconUrl}/eth/v1/config/spec`}),
        this.utilsService.sendHttpRequest({url: `${this.beaconUrl}/eth/v1/node/syncing`}),
        this.utilsService.sendHttpRequest({url: `${this.beaconUrl}/lighthouse/eth1/syncing`}),
      ]);

      const {SECONDS_PER_SLOT} = beaconSpec.data.data
      const {head_slot, sync_distance, is_syncing} = beaconResponse.data.data;
      const { head_block_number, head_block_timestamp, latest_cached_block_number,
        latest_cached_block_timestamp, voting_target_timestamp, eth1_node_sync_status_percentage } = executionResponse.data.data;

      const distance = Number(head_slot) + Number(sync_distance);

      return {
        beaconSync: {
          headSlot: Number(head_slot),
          slotDistance: distance,
          beaconPercentage: getPercentage(head_slot, distance),
          beaconSyncTime: Number(sync_distance) * Number(SECONDS_PER_SLOT),
          syncDistance: Number(sync_distance),
          isSyncing: is_syncing,
        },
        executionSync: {
          headSlot: Number(head_block_number || 0),
          headTimestamp: head_block_timestamp,
          cachedHeadSlot: Number(latest_cached_block_number || 0),
          cachedHeadTimestamp: latest_cached_block_timestamp,
          votingTimestamp: voting_target_timestamp,
          syncPercentage: Number(eth1_node_sync_status_percentage || 0),
          isReady: eth1_node_sync_status_percentage === 100,
        },
      };
    } catch (e) {
      console.error(e);
      throw new Error('Unable to fetch sync data');
    }
  }

  async fetchInclusionRate() {
    try {
      const [beaconSpec, beaconResponse] = await Promise.all([
        this.utilsService.sendHttpRequest({url: `${this.beaconUrl}/eth/v1/config/spec`}),
        this.utilsService.sendHttpRequest({url: `${this.beaconUrl}/eth/v1/node/syncing`}),
      ]);

      const {SLOTS_PER_EPOCH} = beaconSpec.data.data
      const {head_slot} = beaconResponse.data.data;

      const epoch = Math.floor(Number(head_slot) / Number(SLOTS_PER_EPOCH)) - 1

      const {data} = await this.utilsService.sendHttpRequest({url: `${this.beaconUrl}/lighthouse/validator_inclusion/${epoch}/global`})

      const { previous_epoch_target_attesting_gwei, previous_epoch_active_gwei } = data.data

      const rate = Math.round((previous_epoch_target_attesting_gwei / previous_epoch_active_gwei) * 100)

      const status = getStatus(rate)

      return {
        rate,
        status
      }
    } catch (e) {
      console.error(e);
      throw new Error('Unable to fetch inclusion data');
    }
  }

  async fetchPeerData() {
    try {
      const {data} = await this.utilsService.sendHttpRequest({url: `${this.beaconUrl}/eth/v1/node/peer_count`})
      return {connected: Number(data.data.connected)}
    } catch (e) {
      console.error(e)
      throwServerError('Unable to fetch peer data')
    }
  }

  async fetchValidatorCount() {
    try {
      const {data} = await this.utilsService.sendHttpRequest({url: `${this.beaconUrl}/lighthouse/ui/validator_count`})
      return data.data
    } catch (e) {
      console.error(e)
      throwServerError('Unable to fetch validator count data')
    }
  }
}
