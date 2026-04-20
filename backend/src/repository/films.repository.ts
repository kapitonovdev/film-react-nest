import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { FilmDto, ScheduleDto } from '../films/dto/films.dto';
import { FILM_MODEL } from './repository.constants';
import { FilmRecord, ScheduleRecord } from './repository.types';

@Injectable()
export class FilmsRepository {
  constructor(
    @Inject(FILM_MODEL)
    private readonly filmModel: Model<FilmRecord>,
  ) {}

  async getFilms(): Promise<FilmDto[]> {
    const items = await this.filmModel
      .find({}, { _id: 0, schedule: 0 })
      .lean()
      .exec();

    return items.map(
      ({
        id,
        rating,
        director,
        tags,
        title,
        about,
        description,
        image,
        cover,
      }) => ({
        id,
        rating,
        director,
        tags,
        title,
        about,
        description,
        image,
        cover,
      }),
    );
  }

  async getScheduleByFilmId(id: string): Promise<ScheduleDto[] | null> {
    const film = await this.filmModel
      .findOne({ id }, { _id: 0, schedule: 1 })
      .lean()
      .exec();

    if (!film) {
      return null;
    }

    return film.schedule.map((schedule) => this.mapSchedule(schedule));
  }

  async getFilmSession(
    filmId: string,
    sessionId: string,
  ): Promise<ScheduleDto | null> {
    const film = await this.filmModel
      .findOne(
        { id: filmId, 'schedule.id': sessionId },
        { _id: 0, 'schedule.$': 1 },
      )
      .lean()
      .exec();

    if (!film || film.schedule.length === 0) {
      return null;
    }

    return this.mapSchedule(film.schedule[0]);
  }

  async reserveSeats(
    filmId: string,
    sessionId: string,
    seatKeys: string[],
  ): Promise<void> {
    await this.filmModel
      .updateOne(
        { id: filmId, 'schedule.id': sessionId },
        { $addToSet: { 'schedule.$.taken': { $each: seatKeys } } },
      )
      .exec();
  }

  private mapSchedule(schedule: ScheduleRecord): ScheduleDto {
    return {
      id: schedule.id,
      daytime: schedule.daytime,
      hall: String(schedule.hall),
      rows: schedule.rows,
      seats: schedule.seats,
      price: schedule.price,
      taken: schedule.taken,
    };
  }
}
