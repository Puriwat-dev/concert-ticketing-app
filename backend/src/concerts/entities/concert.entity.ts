import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('concerts')
export class Concert {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column('text')
  description!: string;

  @Column('int')
  totalSeats!: number;
}
