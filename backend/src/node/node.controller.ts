import { Controller, Get } from '@nestjs/common';
import { NodeService } from './node.service';

@Controller('node')
export class NodeController {
  constructor(private nodeService: NodeService) {}

  @Get('health')
  async getHealthData() {
    return this.nodeService.fetchNodeHealth();
  }
}
