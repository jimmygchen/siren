import { Controller, Get, UseGuards } from '@nestjs/common';
import { NodeService } from './node.service';
import { SessionGuard } from '../session.guard';

@Controller('node')
@UseGuards(SessionGuard)
export class NodeController {
  constructor(private nodeService: NodeService) {}

  @Get('health')
  async getHealthData() {
    return this.nodeService.fetchNodeHealth();
  }
}
