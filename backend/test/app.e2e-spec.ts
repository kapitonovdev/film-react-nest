import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';
import { FilmsRepository } from '../src/repository/films.repository';
import {
  FILM_MODEL,
  MONGOOSE_CONNECTION,
} from '../src/repository/repository.constants';

const film = {
  id: 'film-1',
  rating: 8.5,
  director: 'Director',
  tags: ['Drama'],
  title: 'Film title',
  about: 'Short description',
  description: 'Long description',
  image: '/bg1s.jpg',
  cover: '/bg1c.jpg',
};

const schedule = {
  id: 'session-1',
  daytime: '2024-06-28T10:00:53+03:00',
  hall: '1',
  rows: 5,
  seats: 10,
  price: 350,
  taken: [] as string[],
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let repository: {
    getFilms: jest.Mock;
    getScheduleByFilmId: jest.Mock;
    getFilmSession: jest.Mock;
    reserveSeats: jest.Mock;
  };

  beforeEach(async () => {
    const scheduleState = { ...schedule, taken: [] as string[] };

    repository = {
      getFilms: jest.fn().mockResolvedValue([film]),
      getScheduleByFilmId: jest.fn().mockImplementation(async (id: string) => {
        if (id !== film.id) {
          return null;
        }

        return [scheduleState];
      }),
      getFilmSession: jest
        .fn()
        .mockImplementation(async (filmId: string, sessionId: string) => {
          if (filmId !== film.id || sessionId !== schedule.id) {
            return null;
          }

          return scheduleState;
        }),
      reserveSeats: jest
        .fn()
        .mockImplementation(
          async (_filmId: string, _sessionId: string, seatKeys: string[]) => {
            scheduleState.taken.push(...seatKeys);
          },
        ),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(FilmsRepository)
      .useValue(repository)
      .overrideProvider(MONGOOSE_CONNECTION)
      .useValue({})
      .overrideProvider(FILM_MODEL)
      .useValue({})
      .compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/api/afisha/films (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/afisha/films')
      .expect(200)
      .expect({
        total: 1,
        items: [film],
      });
  });

  it('/api/afisha/films/:id/schedule (GET)', () => {
    return request(app.getHttpServer())
      .get(`/api/afisha/films/${film.id}/schedule`)
      .expect(200)
      .expect({
        total: 1,
        items: [schedule],
      });
  });

  it('/api/afisha/order (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/afisha/order')
      .send({
        email: 'test@example.com',
        phone: '+79990000000',
        tickets: [
          {
            film: film.id,
            session: schedule.id,
            daytime: schedule.daytime,
            row: 2,
            seat: 3,
            price: schedule.price,
          },
        ],
      })
      .expect(201);

    expect(response.body.total).toBe(1);
    expect(response.body.items[0]).toMatchObject({
      film: film.id,
      session: schedule.id,
      daytime: schedule.daytime,
      row: 2,
      seat: 3,
      price: schedule.price,
    });
    expect(response.body.items[0].id).toEqual(expect.any(String));
  });

  it('rejects duplicate seat in request', () => {
    return request(app.getHttpServer())
      .post('/api/afisha/order')
      .send({
        email: 'test@example.com',
        phone: '+79990000000',
        tickets: [
          {
            film: film.id,
            session: schedule.id,
            daytime: schedule.daytime,
            row: 2,
            seat: 3,
            price: schedule.price,
          },
          {
            film: film.id,
            session: schedule.id,
            daytime: schedule.daytime,
            row: 2,
            seat: 3,
            price: schedule.price,
          },
        ],
      })
      .expect(400)
      .expect({
        error: 'The same seat cannot be booked twice in one request',
      });
  });

  it('rejects already taken seat', async () => {
    await request(app.getHttpServer())
      .post('/api/afisha/order')
      .send({
        email: 'test@example.com',
        phone: '+79990000000',
        tickets: [
          {
            film: film.id,
            session: schedule.id,
            daytime: schedule.daytime,
            row: 2,
            seat: 3,
            price: schedule.price,
          },
        ],
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/afisha/order')
      .send({
        email: 'test@example.com',
        phone: '+79990000000',
        tickets: [
          {
            film: film.id,
            session: schedule.id,
            daytime: schedule.daytime,
            row: 2,
            seat: 3,
            price: schedule.price,
          },
        ],
      })
      .expect(400)
      .expect({
        error: 'Seat 2:3 has already been taken',
      });
  });

  it('/content/afisha/bg1s.jpg (GET)', () => {
    return request(app.getHttpServer())
      .get('/content/afisha/bg1s.jpg')
      .expect(200);
  });
});
