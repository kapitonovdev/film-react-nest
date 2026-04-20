import { Provider } from '@nestjs/common';
import mongoose, { Connection, Model } from 'mongoose';

import { AppConfig, CONFIG_TOKEN } from '../app.config.provider';
import { FilmSchema } from './film.schema';
import { FILM_MODEL, MONGOOSE_CONNECTION } from './repository.constants';
import { FilmRecord } from './repository.types';

export const repositoryProviders: Provider[] = [
  {
    provide: MONGOOSE_CONNECTION,
    inject: [CONFIG_TOKEN],
    useFactory: async (config: AppConfig): Promise<Connection> =>
      mongoose.createConnection(config.database.url).asPromise(),
  },
  {
    provide: FILM_MODEL,
    inject: [MONGOOSE_CONNECTION],
    useFactory: (connection: Connection): Model<FilmRecord> =>
      connection.model<FilmRecord>('Film', FilmSchema, 'films'),
  },
];
