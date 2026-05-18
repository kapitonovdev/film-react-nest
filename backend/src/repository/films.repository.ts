import { FilmDto, ScheduleDto } from '../films/dto/films.dto';

export abstract class FilmsRepository {
  abstract getFilms(): Promise<FilmDto[]>;

  abstract getScheduleByFilmId(id: string): Promise<ScheduleDto[] | null>;

  abstract getFilmSession(
    filmId: string,
    sessionId: string,
  ): Promise<ScheduleDto | null>;

  abstract reserveSeats(
    filmId: string,
    sessionId: string,
    seatKeys: string[],
  ): Promise<void>;
}
