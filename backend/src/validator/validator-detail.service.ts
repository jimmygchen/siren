import { Injectable } from '@nestjs/common';
import { UtilsService } from '../utils/utils.service';
import {InjectModel} from '@nestjs/sequelize';
import { LighthouseValidatorResult } from '../../../src/types/validator';
import { Validator } from './entities/validator.entity';
import { SpecsService } from '../specs/specs.service';
import * as moment from 'moment';

@Injectable()
export class ValidatorDetailService {
  constructor(
    @InjectModel(Validator)
    private validatorRepository: typeof Validator,
    private specService: SpecsService,
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

  async findOrFetch(): Promise<any[]> {
    const validatorDetails = await this.validatorRepository.findAll();

    if(validatorDetails.length) {
      const now = moment()
      const { SLOTS_PER_EPOCH, SECONDS_PER_SLOT } = await this.specService.findOrFetch()

      const secondsPerEpoch = Number(SLOTS_PER_EPOCH) * Number(SECONDS_PER_SLOT)
      const validatorData = validatorDetails.map(details => details.dataValues)

      const isValid = validatorData.every(validator => {
        const createdAt = moment(validator.createdAt)
        const diffInSeconds = now.diff(createdAt, 'seconds')

        return diffInSeconds <= secondsPerEpoch
      })

      if(isValid) {
        return validatorData
      } else {
        await this.validatorRepository.destroy({truncate: true})
      }
    }

    const { data } = await this.utilsService.sendHttpRequest({
      url: `${this.validatorUrl}/lighthouse/validators`,
      config: this.config,
    });
    const validatorKeys = data.data.map((validator: LighthouseValidatorResult) => validator.voting_pubkey)
      .join(',')

    const { data: states } = await this.utilsService.sendHttpRequest({
      url: `${this.beaconUrl}/eth/v1/beacon/states/head/validators?id=${validatorKeys}`,
    });

    const newValDetails = states.data.map(({index, validator: {pubkey, withdrawal_credentials}}) => ({index, pubkey, withdrawal_credentials }))

    await this.validatorRepository.bulkCreate(newValDetails)

    return newValDetails
  }
}
