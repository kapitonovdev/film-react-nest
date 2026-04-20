import { Controller, Get, Param } from '@nestjs/common';

import { FilmsResponseDto, ScheduleResponseDto } from './dto/films.dto';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  getFilms(): Promise<FilmsResponseDto> {
    return this.filmsService.getFilms();
  }

  @Get(':id/schedule')
  getSchedule(@Param('id') id: string): Promise<ScheduleResponseDto> {
    return this.filmsService.getSchedule(id);
  }
}
