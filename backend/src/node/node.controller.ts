import { Controller, Get, UseGuards } from '@nestjs/common';
import { NodeService } from './node.service';
import { AuthGuard } from '../auth.guard';

@Controller('node')
@UseGuards(AuthGuard)
export class NodeController {
  constructor(private nodeService: NodeService) {}

  @Get('health')
  async getHealthData() {
    return this.nodeService.fetchNodeHealth();
  }
}
