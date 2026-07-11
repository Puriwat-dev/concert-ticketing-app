import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Concert } from '../../concerts/entities/concert.entity';
import { User } from '../../users/entities/user.entity';

export enum ReservationAction {
  RESERVE = 'RESERVE',
  CANCEL = 'CANCEL',
}
@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Concert)
  concert!: Concert;

  @Column({
    type: 'enum',
    enum: ReservationAction,
    default: ReservationAction.RESERVE,
  })
  action!: ReservationAction;

  @UpdateDateColumn()
  updatedAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}
