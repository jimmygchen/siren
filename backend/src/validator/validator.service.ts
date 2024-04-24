import { Injectable } from '@nestjs/common';
import { throwServerError } from '../utilities';
import { UtilsService } from '../utils/utils.service';
import {
  BeaconValidatorResult,
} from '../../../src/types/validator';
import formatDefaultValName from '../../../utilities/formatDefaultValName';
import { formatUnits } from 'ethers/lib/utils';
import { ValidatorDetailService } from './validator-detail.service';

@Injectable()
export class ValidatorService {
  constructor(private utilsService: UtilsService, private validatorDetailService: ValidatorDetailService) {}
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
      const validatorDetails = await this.validatorDetailService.findOrFetch();
      const { data: states } = await this.utilsService.sendHttpRequest({
        url: `${this.beaconUrl}/eth/v1/beacon/states/head/validators?id=${validatorDetails.map(({pubkey}) => pubkey)}`,
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
      const validatorDetails = await this.validatorDetailService.findOrFetch();
      const requestData = {
        data: JSON.stringify({
          indices: validatorDetails.map(({index}) => String(index)),
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

  async fetchMetrics() {
    try {
      const validatorDetails = await this.validatorDetailService.findOrFetch();
      const requestData = {
        data: JSON.stringify({
          indices: validatorDetails.map(({index}) => index),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data: metrics } = await this.utilsService.sendHttpRequest({
        url: `${this.beaconUrl}/lighthouse/ui/validator_metrics`,
        method: 'POST',
        config: requestData,
      });

      return metrics.data.validators;
    } catch (e) {
      console.error(e);
      throwServerError('Unable to fetch validator metrics');
    }
  }
}
