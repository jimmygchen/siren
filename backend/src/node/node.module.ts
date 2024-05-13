import { Module } from '@nestjs/common';
import { NodeService } from './node.service';
import { UtilsModule } from '../utils/utils.module';
import { NodeController } from './node.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [UtilsModule, CacheModule.register()],
  controllers: [NodeController],
  providers: [NodeService],
})
export class NodeModule {}
