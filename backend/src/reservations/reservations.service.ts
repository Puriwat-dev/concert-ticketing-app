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
import { Reservation } from './entities/reservation.entity';

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

      if (!concert) {
        throw new NotFoundException('Concert not found');
      }

      const existingReservation = await manager.findOne(Reservation, {
        where: { user: { id: userId }, concert: { id: concertId } },
      });

      if (existingReservation) {
        throw new ConflictException(
          'You have already reserved a seat for this concert',
        );
      }

      const currentReservations = await manager.count(Reservation, {
        where: { concert: { id: concertId } },
      });

      if (currentReservations >= concert.totalSeats) {
        throw new BadRequestException('This concert is fully booked');
      }

      const reservation = manager.create(Reservation, {
        user: { id: userId },
        concert: { id: concertId },
      });

      await manager.save(reservation);
      return {
        message: 'Seat successfully reserved',
        reservationId: reservation.id,
      };
    });
  }

  async cancel(userId: string, reservationId: string) {
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId, user: { id: userId } },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found or you do not own it');
    }

    await this.reservationRepository.remove(reservation);
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
