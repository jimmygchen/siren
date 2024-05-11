import { Inject, Injectable } from '@nestjs/common';
import { throwServerError } from '../utilities';
import { UtilsService } from '../utils/utils.service';
import {
  BeaconValidatorResult, ValidatorDetail
} from '../../../src/types/validator';
import formatDefaultValName from '../../../utilities/formatDefaultValName';
import { formatUnits } from 'ethers/lib/utils';
import { Metric } from './entities/metric.entity';
import getAverageKeyValue from '../../../utilities/getAverageKeyValue';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ValidatorService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private utilsService: UtilsService
  ) {}
  private validatorUrl = process.env.VALIDATOR_URL;
  private apiToken = process.env.API_TOKEN;
  private beaconUrl = process.env.BEACON_URL;

  private config = {
    headers: {
      Authorization: `Bearer ${this.apiToken}`,
    },
  };

  async fetchValidatorAuthKey() {
    try {
      const data = await this.utilsService.sendHttpRequest({
        url: `${this.validatorUrl}/lighthouse/auth`,
      });
      return data.data;
    } catch (e) {
      throwServerError('Unable to fetch validator auth key');
    }
  }

  async fetchValidatorVersion() {
    try {
      const { data } = await this.utilsService.sendHttpRequest({
        url: `${this.validatorUrl}/lighthouse/version`,
        config: this.config,
      });
      return data.data;
    } catch (e) {
      throwServerError('Unable to fetch validator version');
    }
  }

  async fetchValidatorStates() {
    try {
      const validatorData = await this.cacheManager.get('validators') as ValidatorDetail[]
      const { data: states } = await this.utilsService.sendHttpRequest({
        url: `${this.beaconUrl}/eth/v1/beacon/states/head/validators?id=${validatorData.map(({pubkey}) => pubkey)}`,
      });

      const sortedStates = [...states.data].sort(
        (a: BeaconValidatorResult, b: BeaconValidatorResult) =>
          Number(a.index) - Number(b.index),
      );

      return sortedStates.map(
        ({ validator, index, status, balance }: BeaconValidatorResult) => {
          return {
            name: formatDefaultValName(index),
            pubKey: validator.pubkey,
            balance: Number(formatUnits(balance, 'gwei')),
            rewards: Number(formatUnits(balance, 'gwei')) - 32,
            index: Number(index),
            slashed: validator.slashed,
            withdrawalAddress: validator.withdrawal_credentials,
            status: status,
            processed: 0,
            missed: 0,
            attested: 0,
            aggregated: 0,
          };
        },
      );
    } catch (e) {
      throwServerError('Unable to fetch validator states');
    }
  }

  async fetchValidatorCaches() {
    try {
      const validatorData = await this.cacheManager.get('validators') as ValidatorDetail[]
      const requestData = {
        data: JSON.stringify({
          indices: validatorData.map(({index}) => index),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data: caches } = await this.utilsService.sendHttpRequest({
        url: `${this.beaconUrl}/lighthouse/ui/validator_info`,
        method: 'POST',
        config: requestData,
      });

      return Object.fromEntries(
        Object.entries(
          caches.data.validators as Record<
            number,
            { info: { epoch: string; total_balance: string } }
          >,
        ).map(([key, data]) => [Number(key), data.info]),
      );
    } catch (e) {
      console.error(e);
      throwServerError('Unable to fetch validator cache');
    }
  }

  async fetchMetrics(index?: number) {
    try {
      const options = index ? {where: {index}} : undefined
      const metrics = await this.utilsService.fetchAll(Metric, options)
      const metricsData = metrics.map(metric => JSON.parse(metric.data))

      const targetEffectiveness = getAverageKeyValue(metricsData, 'attestation_target_hit_percentage')
      const hitEffectiveness = getAverageKeyValue(metricsData, 'attestation_hit_percentage')

      const totalEffectiveness = (targetEffectiveness + hitEffectiveness) / 2

      return {
        targetEffectiveness,
        hitEffectiveness,
        totalEffectiveness
      }
    }
     catch (e) {
      console.error(e)
      throwServerError('Unable to fetch validator validator-metrics')
    }
  }
  async signVoluntaryExit(pubKey: string) {
    try {
      const { data } = await this.utilsService.sendHttpRequest({url: `${this.validatorUrl}/eth/v1/validator/${pubKey}/voluntary_exit`, method: 'POST', config: this.config})

      if (data) {
        return data?.data || data
      }
    } catch (e) {
      console.error(e)
      throwServerError('Unable to sign voluntary exit')
    }
  }
}
