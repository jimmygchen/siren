import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { UtilsService } from '../utils/utils.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { Spec } from '../beacon/entities/spec.entity';
import { BeaconNodeSpecResults } from '../../../src/types/beacon';
import { Validator } from '../validator/entities/validator.entity';
import { LighthouseValidatorResult, ValidatorDetail } from '../../../src/types/validator';
import { Metric } from '../validator/entities/metric.entity';
import {Op} from 'sequelize'
import * as moment from 'moment';

@Injectable()
export class TasksService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(Spec)
    private specRepository: typeof Spec,
    @InjectModel(Validator)
    private validatorRepository: typeof Validator,
    @InjectModel(Metric)
    private metricRepository: typeof Metric,
    private utilsService: UtilsService,
    private schedulerRegistry: SchedulerRegistry
  ) {}

  private beaconUrl = process.env.BEACON_URL;
  private validatorUrl = process.env.VALIDATOR_URL;
  private apiToken = process.env.API_TOKEN;

  async onApplicationBootstrap(): Promise<void> {
    try {
      console.log('Application Bootstrapping....')
      await this.specRepository.destroy({truncate: true})
      await this.validatorRepository.destroy({truncate: true})
      await this.metricRepository.destroy({truncate: true})

      const specs = await this.syncBeaconSpecs()
      await this.initValidatorDataScheduler(specs)
      await this.initMetricDataScheduler(specs)

    } catch (e) {
      console.error('Unable to bootstrap application repositories...')
    }
  }

  private async initMetricDataScheduler(specs: BeaconNodeSpecResults) {
    const secondsPerEpoch = (Number(specs.SLOTS_PER_EPOCH) * Number(specs.SECONDS_PER_SLOT))

    await this.syncMetricData(secondsPerEpoch)

    this.setDynamicInterval('metricTask', (secondsPerEpoch + 1) * 1000, async () => {
      await this.syncMetricData(secondsPerEpoch)
    })
  }

  private async syncMetricData(secondsPerEpoch: number) {
    const thresholdDate = moment().subtract(secondsPerEpoch * 10, 'seconds').toDate();

    await this.metricRepository.destroy({
      where: {
        createdAt: {
          [Op.lt]: thresholdDate
        }
      }
    });

    const validatorData = await this.utilsService.fetchAll(Validator)
    const requestData = {
      data: JSON.stringify({
        indices: validatorData.map(({index}) => index),
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

    const metricData = metrics.data.validators
    const indices = Object.keys(metricData)

    await this.metricRepository.bulkCreate(indices.map(index => ({index, data: JSON.stringify(metricData[index])})))
  }

  private async syncBeaconSpecs(): Promise<BeaconNodeSpecResults> {
    const specs = await this.fetchSpecs();
    await this.storeSpecs(specs)

    return specs
  }

  private async syncValidatorData() {
    console.log('Syncing validator data...')
    const validators = await this.fetchValidators()
    await this.storeValidators(validators)
  }

  private async initValidatorDataScheduler(specs: BeaconNodeSpecResults) {
    const secondsPerEpoch = Number(specs.SLOTS_PER_EPOCH) * Number(specs.SECONDS_PER_SLOT)

    await this.syncValidatorData()

    this.setDynamicInterval('validatorTask', secondsPerEpoch * 1000, async () => {
      await this.syncValidatorData()
    })
  }

  private async fetchValidators(): Promise<ValidatorDetail[]> {
    const { data } = await this.utilsService.sendHttpRequest({
      url: `${this.validatorUrl}/lighthouse/validators`,
      config: {
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
        },
      },
    });
    const validatorKeys = data.data.map((validator: LighthouseValidatorResult) => validator.voting_pubkey)
      .join(',')

    const { data: states } = await this.utilsService.sendHttpRequest({
      url: `${this.beaconUrl}/eth/v1/beacon/states/head/validators?id=${validatorKeys}`,
    });

    return states.data.map(({index, validator: {pubkey, withdrawal_credentials}}) => ({index, pubkey, withdrawal_credentials }))
  }

  private async storeValidators(validators: ValidatorDetail[]) {
    await this.validatorRepository.sequelize.transaction(async t => {
      await this.validatorRepository.destroy({truncate: true, transaction: t})
      await this.validatorRepository.bulkCreate(validators, {ignoreDuplicates: true, transaction: t})
    })
  }

  private async fetchSpecs() : Promise<BeaconNodeSpecResults> {
    console.log('Fetching node specs...')
    const { data } = await this.utilsService.sendHttpRequest({
      url: `${this.beaconUrl}/eth/v1/config/spec`,
    });
    return data.data
  }

  private async storeSpecs(specs: BeaconNodeSpecResults) {
    console.log('Storing node spec data...')
    const data = JSON.stringify(specs)
    await this.specRepository.create({data})
  }

  private setDynamicInterval(name: string, milliseconds: number, callback: () => void) {
    const interval = setInterval(callback, milliseconds);
    this.schedulerRegistry.addInterval(name, interval);
    console.log(`Interval ${name} set to run every ${milliseconds / 1000} seconds`);
  }

}
