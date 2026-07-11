import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Concert } from '../concerts/entities/concert.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation, ReservationAction } from './entities/reservation.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    private readonly dataSource: DataSource,
  ) {}

  async reserve(userId: string, createReservationDto: CreateReservationDto) {
    const { concertId } = createReservationDto;

    return await this.dataSource.transaction(async (manager) => {
      const concert = await manager.findOne(Concert, {
        where: { id: concertId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!concert) throw new NotFoundException('Concert not found');

      const existingReservation = await manager.findOne(Reservation, {
        where: { user: { id: userId }, concert: { id: concertId } },
      });

      if (existingReservation) {
        if (existingReservation.action === ReservationAction.RESERVE) {
          throw new ConflictException(
            'You have already reserved a seat for this concert',
          );
        }
      }

      const currentActiveSeats = await manager.count(Reservation, {
        where: {
          concert: { id: concertId },
          action: ReservationAction.RESERVE,
        },
      });

      if (currentActiveSeats >= concert.totalSeats) {
        throw new BadRequestException('This concert is fully booked');
      }

      if (existingReservation) {
        existingReservation.action = ReservationAction.RESERVE;
        await manager.save(existingReservation);
        return {
          message: 'Seat successfully re-reserved',
          reservationId: existingReservation.id,
        };
      } else {
        const newReservation = manager.create(Reservation, {
          user: { id: userId },
          concert: { id: concertId },
          action: ReservationAction.RESERVE,
        });
        await manager.save(newReservation);
        return {
          message: 'Seat successfully reserved',
          reservationId: newReservation.id,
        };
      }
    });
  }

  async cancel(userId: string, reservationId: string) {
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId, user: { id: userId } },
    });

    if (!reservation || reservation.action === ReservationAction.CANCEL) {
      throw new NotFoundException(
        'Active reservation not found or you do not own it',
      );
    }

    reservation.action = ReservationAction.CANCEL;
    await this.reservationRepository.save(reservation);

    return { message: 'Reservation successfully canceled' };
  }

  async getUserHistory(userId: string) {
    return await this.reservationRepository.find({
      where: { user: { id: userId } },
      relations: { concert: true },
      order: { createdAt: 'DESC' },
    });
  }

  async getAllReservations() {
    return await this.reservationRepository.find({
      relations: { user: true, concert: true },
      order: { createdAt: 'DESC' },
    });
  }
}
