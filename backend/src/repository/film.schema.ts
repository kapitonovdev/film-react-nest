import { HydratedDocument, Schema } from 'mongoose';

import { FilmRecord } from './repository.types';

export type FilmDocument = HydratedDocument<FilmRecord>;

const ScheduleSchema = new Schema(
  {
    id: { type: String, required: true },
    daytime: { type: String, required: true },
    hall: { type: Schema.Types.Mixed, required: true },
    rows: { type: Number, required: true },
    seats: { type: Number, required: true },
    price: { type: Number, required: true },
    taken: { type: [String], default: [] },
  },
  {
    _id: false,
    versionKey: false,
  },
);

export const FilmSchema = new Schema<FilmRecord>(
  {
    id: { type: String, required: true, unique: true, index: true },
    rating: { type: Number, required: true },
    director: { type: String, required: true },
    tags: { type: [String], default: [] },
    title: { type: String, required: true },
    about: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    cover: { type: String, required: true },
    schedule: { type: [ScheduleSchema], default: [] },
  },
  {
    versionKey: false,
  },
);
