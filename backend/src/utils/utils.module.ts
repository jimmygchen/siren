import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { UtilsService } from './utils.service';

@Module({
  imports: [HttpModule],
  providers: [UtilsService],
  exports: [UtilsService],
})
export class UtilsModule {}