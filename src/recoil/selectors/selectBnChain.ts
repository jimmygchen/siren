import { selector } from 'recoil'
import { Network } from '../../constants/enums'
import { beaconNodeSpec } from '../atoms'

export const selectBnChain = selector({
  key: 'selectBnChain',
  get: ({ get }) => {
    const specs = get(beaconNodeSpec)
    if (!specs) return

    const { DEPOSIT_CHAIN_ID } = specs

    switch (DEPOSIT_CHAIN_ID) {
      case '5':
        return Network.Goerli
      case '1':
        return Network.Mainnet
      case '4242':
        return Network.LocalTestnet
      case '17000':
        return Network.Holesky
      default:
        return
    }
  },
})
