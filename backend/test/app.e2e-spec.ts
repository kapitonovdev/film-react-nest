import { INestApplication } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';
import { FilmsRepository } from '../src/repository/films.repository';

const film = {
  id: '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf',
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
  id: 'f2e429b0-685d-41f8-a8cd-1d8cb63b99ce',
  daytime: '2024-06-28T10:00:53+03:00',
  hall: 1,
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
      .overrideProvider(getDataSourceToken())
      .useValue({
        entityMetadatas: [],
        options: { type: 'postgres' },
        getRepository: jest.fn().mockReturnValue({}),
        getTreeRepository: jest.fn().mockReturnValue({}),
        getMongoRepository: jest.fn().mockReturnValue({}),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
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

  it('/api/afisha/films/:id/schedule returns 422 for invalid uuid (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/afisha/films/test/schedule')
      .expect(422);
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

  it('/api/afisha/order accepts array payload (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/afisha/order')
      .send([
        {
          film: film.id,
          session: schedule.id,
          daytime: schedule.daytime,
          row: 4,
          seat: 6,
          price: schedule.price,
        },
      ])
      .expect(201);

    expect(response.body.total).toBe(1);
    expect(response.body.items[0]).toMatchObject({
      film: film.id,
      session: schedule.id,
      daytime: schedule.daytime,
      row: 4,
      seat: 6,
      price: schedule.price,
    });
  });

  it('returns 422 for invalid ticket uuid', () => {
    return request(app.getHttpServer())
      .post('/api/afisha/order')
      .send({
        tickets: [
          {
            film: 'test',
            session: schedule.id,
            daytime: schedule.daytime,
            row: 2,
            seat: 3,
            price: schedule.price,
          },
        ],
      })
      .expect(422);
  });

  it('returns 422 for invalid ticket payload', () => {
    return request(app.getHttpServer())
      .post('/api/afisha/order')
      .send({
        tickets: [
          {
            film: film.id,
            session: schedule.id,
            daytime: 'invalid-date',
            row: 0,
            seat: 0,
            price: 0,
          },
        ],
      })
      .expect(422);
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
