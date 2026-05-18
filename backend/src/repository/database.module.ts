import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppConfigModule } from '../app-config.module';
import { AppConfig, CONFIG_TOKEN } from '../app.config.provider';
import { FilmEntity } from './film.entity';
import { ScheduleEntity } from './schedule.entity';

@Global()
@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [CONFIG_TOKEN],
      useFactory: (config: AppConfig) => ({
        type: config.database.driver as 'postgres',
        host: config.database.host,
        port: config.database.port,
        database: config.database.name,
        username: config.database.username,
        password: config.database.password,
        entities: [FilmEntity, ScheduleEntity],
        synchronize: false,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
