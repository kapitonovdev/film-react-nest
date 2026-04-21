DROP TABLE IF EXISTS schedules;
DROP TABLE IF EXISTS films;

CREATE TABLE IF NOT EXISTS films (
  id uuid PRIMARY KEY,
  rating double precision NOT NULL,
  director text NOT NULL,
  tags text[] NOT NULL DEFAULT ARRAY[]::text[],
  title text NOT NULL,
  about text NOT NULL,
  description text NOT NULL,
  image text NOT NULL,
  cover text NOT NULL
);

CREATE TABLE IF NOT EXISTS schedules (
  id uuid PRIMARY KEY,
  film_id uuid NOT NULL REFERENCES films(id) ON DELETE CASCADE,
  daytime timestamptz NOT NULL,
  hall integer NOT NULL,
  rows integer NOT NULL,
  seats integer NOT NULL,
  price integer NOT NULL,
  taken text[] NOT NULL DEFAULT ARRAY[]::text[]
);

CREATE INDEX IF NOT EXISTS idx_schedules_film_id ON schedules(film_id);
