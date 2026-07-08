import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Concert } from '../../concerts/entities/concert.entity';
import { User } from '../../users/entities/user.entity';

@Entity('reservations')
@Unique(['user', 'concert'])
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Concert)
  concert!: Concert;

  @CreateDateColumn()
  createdAt!: Date;
}
