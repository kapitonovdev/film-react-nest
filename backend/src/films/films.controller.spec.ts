import { NotFoundException } from '@nestjs/common';

import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let controller: FilmsController;
  let filmsService: jest.Mocked<Pick<FilmsService, 'getFilms' | 'getSchedule'>>;

  const filmId = '7a151dbc-6b69-4684-aa3f-5ff77cacb921';

  beforeEach(() => {
    filmsService = {
      getFilms: jest.fn(),
      getSchedule: jest.fn(),
    };
    controller = new FilmsController(filmsService as unknown as FilmsService);
  });

  describe('.getFilms', () => {
    it('should return films from FilmsService', async () => {
      const response = {
        total: 1,
        items: [
          {
            id: filmId,
            rating: 8.5,
            director: 'Christopher Nolan',
            tags: ['sci-fi'],
            title: 'Interstellar',
            about: 'Space travel',
            description: 'A film about space travel',
            image: '/interstellar.jpg',
            cover: '/interstellar-cover.jpg',
          },
        ],
      };
      filmsService.getFilms.mockResolvedValue(response);

      await expect(controller.getFilms()).resolves.toBe(response);
      expect(filmsService.getFilms).toHaveBeenCalledTimes(1);
    });
  });

  describe('.getSchedule', () => {
    it('should pass film id to FilmsService and return schedule', async () => {
      const response = {
        total: 1,
        items: [
          {
            id: 'b0cd1fa6-51f0-4b6c-b90d-86b16f98e903',
            daytime: '2026-05-08T12:00:00.000Z',
            hall: 1,
            rows: 10,
            seats: 12,
            price: 350,
            taken: [],
          },
        ],
      };
      filmsService.getSchedule.mockResolvedValue(response);

      await expect(controller.getSchedule(filmId)).resolves.toBe(response);
      expect(filmsService.getSchedule).toHaveBeenCalledWith(filmId);
    });

    it('should propagate service errors', async () => {
      const error = new NotFoundException({ error: 'Film was not found' });
      filmsService.getSchedule.mockRejectedValue(error);

      await expect(controller.getSchedule(filmId)).rejects.toBe(error);
    });
  });
});
