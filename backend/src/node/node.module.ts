import { Module } from '@nestjs/common';
import { NodeService } from './node.service';
import { UtilsModule } from '../utils/utils.module';
import { NodeController } from './node.controller';

@Module({
  imports: [UtilsModule],
  controllers: [NodeController],
  providers: [NodeService],
})
export class NodeModule {}
