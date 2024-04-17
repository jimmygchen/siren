import { BeaconSyncInfo, BeaconSyncResult } from '../src/types/diagnostic';
import getPercentage from './getPercentage';

const formatBnSyncInfo = (data: BeaconSyncResult): BeaconSyncInfo => {
  const { head_slot, sync_distance, is_syncing } = data

  const distance = Number(head_slot) + Number(sync_distance)

  return {
    headSlot: Number(head_slot),
    slotDistance: distance,
    beaconPercentage: getPercentage(head_slot, distance),
    beaconSyncTime: Number(sync_distance) * 12,
    isSyncing: is_syncing,
  }
}

export default formatBnSyncInfo