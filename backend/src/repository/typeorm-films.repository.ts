import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FilmDto, ScheduleDto } from '../films/dto/films.dto';
import { FilmEntity } from './film.entity';
import { FilmsRepository } from './films.repository';
import { ScheduleEntity } from './schedule.entity';

@Injectable()
export class TypeOrmFilmsRepository extends FilmsRepository {
  constructor(
    @InjectRepository(FilmEntity)
    private readonly filmRepository: Repository<FilmEntity>,
    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepository: Repository<ScheduleEntity>,
  ) {
    super();
  }

  async getFilms(): Promise<FilmDto[]> {
    const items = await this.filmRepository.find({
      select: {
        id: true,
        rating: true,
        director: true,
        tags: true,
        title: true,
        about: true,
        description: true,
        image: true,
        cover: true,
      },
    });

    return items.map((film) => this.mapFilm(film));
  }

  async getScheduleByFilmId(id: string): Promise<ScheduleDto[] | null> {
    const filmExists = await this.filmRepository.exist({
      where: { id },
    });

    if (!filmExists) {
      return null;
    }

    const schedules = await this.scheduleRepository.find({
      where: { filmId: id },
      order: {
        daytime: 'ASC',
      },
    });

    return schedules.map((schedule) => this.mapSchedule(schedule));
  }

  async getFilmSession(
    filmId: string,
    sessionId: string,
  ): Promise<ScheduleDto | null> {
    const schedule = await this.scheduleRepository.findOne({
      where: {
        id: sessionId,
        filmId,
      },
    });

    if (!schedule) {
      return null;
    }

    return this.mapSchedule(schedule);
  }

  async reserveSeats(
    filmId: string,
    sessionId: string,
    seatKeys: string[],
  ): Promise<void> {
    const schedule = await this.scheduleRepository.findOne({
      where: {
        id: sessionId,
        filmId,
      },
    });

    if (!schedule) {
      return;
    }

    schedule.taken = [...new Set([...(schedule.taken ?? []), ...seatKeys])];
    await this.scheduleRepository.save(schedule);
  }

  private mapFilm(film: FilmEntity): FilmDto {
    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
    };
  }

  private mapSchedule(schedule: ScheduleEntity): ScheduleDto {
    return {
      id: schedule.id,
      daytime: this.toDaytimeString(schedule.daytime),
      hall: schedule.hall,
      rows: schedule.rows,
      seats: schedule.seats,
      price: schedule.price,
      taken: schedule.taken ?? [],
    };
  }

  private toDaytimeString(daytime: Date): string {
    return daytime.toISOString();
  }
}
