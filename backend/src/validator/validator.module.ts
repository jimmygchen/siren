import { Module } from '@nestjs/common';
import { ValidatorController } from './validator.controller';
import { ValidatorService } from './validator.service';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [UtilsModule],
  controllers: [ValidatorController],
  providers: [ValidatorService],
})
export class ValidatorModule {}
