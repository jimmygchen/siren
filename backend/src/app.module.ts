import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BeaconModule } from './beacon/beacon.module';
import { ConfigModule } from '@nestjs/config';
import { ValidatorModule } from './validator/validator.module';
import { NodeModule } from './node/node.module';
import { LogsModule } from './logs/logs.module';

@Module({
  imports: [BeaconModule, ValidatorModule, ConfigModule.forRoot({
    envFilePath: '../.env',
  }), NodeModule, LogsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
