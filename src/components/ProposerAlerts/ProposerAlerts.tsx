import { FC } from 'react'
import { useSetRecoilState } from 'recoil'
import getSlotTimeData from '../../../utilities/getSlotTimeData'
import groupArray from '../../../utilities/groupArray'
import { proposerDuties } from '../../recoil/atoms'
import { ProposerDuty } from '../../types'
import { BeaconNodeSpecResults } from '../../types/beacon';
import AlertGroup from './AlertGroup'
import ProposalAlert from './ProposalAlert'

export interface ProposerAlertsProps {
  duties: ProposerDuty[]
  bnSpec: BeaconNodeSpecResults
  genesisTime: number
}

const ProposerAlerts: FC<ProposerAlertsProps> = ({ duties, bnSpec, genesisTime }) => {
  const { SECONDS_PER_SLOT } = bnSpec
  const setProposers = useSetRecoilState(proposerDuties)
  const groups = groupArray(duties, 10)

  const removeAlert = (uuids: string[]) => {
    setProposers((prev) => prev.filter(({ uuid }) => !uuids.includes(uuid)))
  }

  return (
    <>
      {duties.length >= 10
        ? groups.map((group, index) => (
            <AlertGroup
              onClick={removeAlert}
              genesis={genesisTime}
              secondsPerSlot={SECONDS_PER_SLOT}
              duties={group}
              key={index}
            />
          ))
        : duties.map((duty, index) => {
            const { isFuture, shortHand } = getSlotTimeData(
              Number(duty.slot),
              genesisTime,
              SECONDS_PER_SLOT,
            )
            return (
              <ProposalAlert
                onDelete={removeAlert}
                isFuture={isFuture}
                time={shortHand}
                key={index}
                duty={duty}
              />
            )
          })}
    </>
  )
}

export default ProposerAlerts
