import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FilmEntity } from './film.entity';
import { FilmsRepository } from './films.repository';
import { ScheduleEntity } from './schedule.entity';
import { TypeOrmFilmsRepository } from './typeorm-films.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FilmEntity, ScheduleEntity])],
  providers: [
    TypeOrmFilmsRepository,
    {
      provide: FilmsRepository,
      useExisting: TypeOrmFilmsRepository,
    },
  ],
  exports: [FilmsRepository],
})
export class RepositoryModule {}
