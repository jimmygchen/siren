import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BeaconModule } from './beacon/beacon.module';
import { ConfigModule } from '@nestjs/config';
import { ValidatorModule } from './validator/validator.module';
import { NodeModule } from './node/node.module';
import { LogsModule } from './logs/logs.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { dataBaseConfig } from './database/database.config';
import {ScheduleModule} from '@nestjs/schedule'
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    SequelizeModule.forRoot(dataBaseConfig),
    ConfigModule.forRoot({
      envFilePath: '../.env',
    }),
    ScheduleModule.forRoot(),
    TasksModule,
    BeaconModule,
    ValidatorModule,
    NodeModule,
    LogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
