import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { UtilsService } from '../utils/utils.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { BeaconNodeSpecResults } from '../../../src/types/beacon';
import { LighthouseValidatorResult, ValidatorDetail } from '../../../src/types/validator';
import { Metric } from '../validator/entities/metric.entity';
import {Op} from 'sequelize'
import * as moment from 'moment';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { LogsService } from '../logs/logs.service';
import { LogType } from '../../../src/types';
import { Log } from '../logs/entities/log.entity';

@Injectable()
export class TasksService implements OnApplicationBootstrap {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    @InjectModel(Metric)
    private metricRepository: typeof Metric,
    @InjectModel(Log)
    private logRepository: typeof Log,
    private utilsService: UtilsService,
    private schedulerRegistry: SchedulerRegistry,
    private logsService: LogsService
  ) {}

  private beaconUrl = process.env.BEACON_URL;
  private validatorUrl = process.env.VALIDATOR_URL;
  private apiToken = process.env.API_TOKEN;

  async onApplicationBootstrap(): Promise<void> {
    try {
      console.log('Application Bootstrapping....')
      await this.metricRepository.destroy({truncate: true})
      await this.logRepository.destroy({truncate: true})

      await this.syncBeaconSpecs()
      await this.initValidatorDataScheduler()
      await this.initMetricDataScheduler()

      await this.logsService.startSse(`${this.validatorUrl}/lighthouse/logs`, LogType.VALIDATOR)
      await this.logsService.startSse(`${this.beaconUrl}/lighthouse/logs`, LogType.BEACON)

      this.initLogCleaningScheduler()

    } catch (e) {
      console.error('Unable to bootstrap application repositories...')
    }
  }

  private initLogCleaningScheduler() {
    this.setDynamicInterval('clean-logs', 60000, async () => {
      console.log('cleaning logs database....')
      const thresholdDate = moment().subtract(24, 'hours').toDate();

      await this.logRepository.destroy({
        where: {
          createdAt: {
            [Op.lt]: thresholdDate
          }
        }
      });
    })
  }

  private async initMetricDataScheduler() {
    const { SLOTS_PER_EPOCH, SECONDS_PER_SLOT} = await this.cacheManager.get('specs') as BeaconNodeSpecResults
    const secondsPerEpoch = (Number(SLOTS_PER_EPOCH) * Number(SECONDS_PER_SLOT))
    await this.syncMetricData()
    const interval = (secondsPerEpoch + 1) * 1000

    this.setDynamicInterval('clean-metrics', interval / 2, async () => {
      console.log('cleaning metric database....')
      const thresholdDate = moment().subtract(secondsPerEpoch * 10, 'seconds').toDate();

      await this.metricRepository.destroy({
        where: {
          createdAt: {
            [Op.lt]: thresholdDate
          }
        }
      });
    })

    this.setDynamicInterval('metricTask', interval, async () => {
      await this.syncMetricData()
    })
  }

  private async syncMetricData() {
    const validatorData = await this.cacheManager.get('validators') as ValidatorDetail[]
    const requestData = {
      data: JSON.stringify({
        indices: validatorData.map(({index}) => Number(index)),
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

  private async syncBeaconSpecs() {
    const { data } = await this.utilsService.sendHttpRequest({
      url: `${this.beaconUrl}/eth/v1/config/spec`,
    });
    await this.cacheManager.set('specs', data.data, 0)
  }

  private async syncValidatorData() {
    console.log('Syncing validator data...')

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

    const validators = states.data.map(({index, status, validator: {pubkey, withdrawal_credentials}}) => ({index, pubkey, withdrawal_credentials, status }))

    await this.cacheManager.set('validators', validators, 0)
  }

  private async initValidatorDataScheduler() {
    const { SLOTS_PER_EPOCH, SECONDS_PER_SLOT} = await this.cacheManager.get('specs') as BeaconNodeSpecResults
    const secondsPerEpoch = Number(SLOTS_PER_EPOCH) * Number(SECONDS_PER_SLOT)

    console.log(secondsPerEpoch, 'init validator scheduler....')

    await this.syncValidatorData()

    this.setDynamicInterval('validatorTask', secondsPerEpoch * 1000, async () => {
      await this.syncValidatorData()
    })
  }

  private setDynamicInterval(name: string, milliseconds: number, callback: () => void) {
    const interval = setInterval(callback, milliseconds);
    this.schedulerRegistry.addInterval(name, interval);
    console.log(`Interval ${name} set to run every ${milliseconds / 1000} seconds`);
  }

}
