import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { ScheduleEntity } from './schedule.entity';

@Entity({ name: 'films' })
export class FilmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('float')
  rating: number;

  @Column('text')
  director: string;

  @Column('text', { array: true, default: () => 'ARRAY[]::text[]' })
  tags: string[];

  @Column('text')
  title: string;

  @Column('text')
  about: string;

  @Column('text')
  description: string;

  @Column('text')
  image: string;

  @Column('text')
  cover: string;

  @OneToMany(() => ScheduleEntity, (schedule) => schedule.film)
  schedules?: ScheduleEntity[];
}
