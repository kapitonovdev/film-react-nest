export interface ScheduleRecord {
  id: string;
  daytime: string;
  hall: number | string;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}

export interface FilmRecord {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  title: string;
  about: string;
  description: string;
  image: string;
  cover: string;
  schedule: ScheduleRecord[];
}
