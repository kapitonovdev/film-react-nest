import { Injectable, NotFoundException } from '@nestjs/common';

import { FilmsRepository } from '../repository/films.repository';
import { FilmsResponseDto, ScheduleResponseDto } from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async getFilms(): Promise<FilmsResponseDto> {
    const items = await this.filmsRepository.getFilms();

    return {
      total: items.length,
      items,
    };
  }

  async getSchedule(id: string): Promise<ScheduleResponseDto> {
    const items = await this.filmsRepository.getScheduleByFilmId(id);

    if (!items) {
      throw new NotFoundException({ error: 'Film was not found' });
    }

    return {
      total: items.length,
      items,
    };
  }
}
