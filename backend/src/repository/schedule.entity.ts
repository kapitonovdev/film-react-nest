import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { FilmEntity } from './film.entity';

@Entity({ name: 'schedules' })
export class ScheduleEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid', { name: 'film_id' })
  filmId: string;

  @ManyToOne(() => FilmEntity, (film) => film.schedules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'film_id' })
  film: FilmEntity;

  @Column('timestamptz')
  daytime: Date;

  @Column('integer')
  hall: number;

  @Column('integer')
  rows: number;

  @Column('integer')
  seats: number;

  @Column('integer')
  price: number;

  @Column('text', { array: true, default: () => 'ARRAY[]::text[]' })
  taken: string[];
}
