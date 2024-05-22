export const mockEpochCacheValue = { SLOTS_PER_EPOCH: '32', SECONDS_PER_SLOT: '12' };

export const mockedSyncNodeResults = {
  beacon: { head_slot: '1', sync_distance: '1', is_syncing: false },
  execution: {
    head_block_number: '1',
    head_block_timestamp: '1',
    latest_cached_block_number: '1',
    latest_cached_block_timestamp: '1',
    voting_target_timestamp: '1',
    eth1_node_sync_status_percentage: '1',
  }
}

export const mockedSyncResults = {
  beaconSync: {
    "beaconPercentage": 50,
    "beaconSyncTime": 12,
    "headSlot": 1,
    "isSyncing": false,
    "slotDistance": 2,
    "syncDistance": 1,
  },
  executionSync: {
    "cachedHeadSlot": 1,
    "cachedHeadTimestamp": "1",
    "headSlot": 1,
    "headTimestamp": "1",
    "isReady": false,
    "syncPercentage": 1,
    "votingTimestamp": "1",
  }
}

export const mockValCacheValues = [
  {
    index: '1',
    pubkey: 'fake-pub',
    status: 'active_ongoing',
    withdrawal_credentials: 'fake-creds'
  }
];