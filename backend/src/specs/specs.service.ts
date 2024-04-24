import { Injectable } from '@nestjs/common';
// import { CreateSpecDto } from './dto/create-spec.dto';
import { UpdateSpecDto } from './dto/update-spec.dto';
import {InjectModel} from '@nestjs/sequelize';
import { Spec } from './entities/spec.entity';
import { UtilsService } from '../utils/utils.service';
import { BeaconNodeSpecResults } from '../../../src/types/beacon';

@Injectable()
export class SpecsService {
  constructor(
    @InjectModel(Spec)
    private specRepository: typeof Spec,
    private utilsService: UtilsService
  ) {}

  private beaconUrl = process.env.BEACON_URL;

  async findOrFetch(): Promise<BeaconNodeSpecResults> {
    const spec = await this.specRepository.findOne()

    if(spec) {
      return JSON.parse(spec.data)
    }

    console.log('specs from node....')

    const { data } = await this.utilsService.sendHttpRequest({
      url: `${this.beaconUrl}/eth/v1/config/spec`,
    });

    const specData = data.data
    const newSpec = JSON.stringify(specData)

    await this.specRepository.create({data: newSpec})

    console.log('saving specs....')

    return specData
  }

  update(id: number, updateSpecDto: UpdateSpecDto) {
    return `This action updates a #${id} spec`;
  }
}
