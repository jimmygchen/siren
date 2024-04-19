import { DiagnosticRate } from '../constants/enums';
import { StatusColor } from '../types';

export const mockBeaconSpec = {
  CONFIG_NAME: 'mock-name',
  DEPOSIT_CHAIN_ID: 'mock-id',
  DEPOSIT_CONTRACT_ADDRESS: 'mock-address',
  DEPOSIT_NETWORK_ID: 'mock-network-id',
  SECONDS_PER_SLOT: '12',
}

export const mockDiagnostics = {
  totalDiskSpace: 123,
  diskUtilization: 123,
  totalDiskFree: 123,
  diskStatus: {
    synced: StatusColor.ERROR,
    syncing: StatusColor.ERROR
  },
  totalMemory: 123,
  memoryUtilization: 123,
  frequency: '10hz',
  ramStatus: StatusColor.ERROR,
  cpuStatus: StatusColor.ERROR,
  cpuUtilization: '19gb',
  networkName: 'exmple',
  natOpen: false,
  uptime: {
    beacon: '10m',
    validator: '19m'
  },
  healthCondition: {
    synced: DiagnosticRate.FAIR,
    syncing: DiagnosticRate.FAIR
  },
  overallHealthStatus: {
    synced: StatusColor.ERROR,
    syncing: StatusColor.ERROR
  }
}
