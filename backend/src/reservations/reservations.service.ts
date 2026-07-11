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

      const latestRecord = await manager.findOne(Reservation, {
        where: { user: { id: userId }, concert: { id: concertId } },
        order: { createdAt: 'DESC' },
      });

      if (latestRecord && latestRecord.action === ReservationAction.RESERVE) {
        throw new ConflictException(
          'You already hold an active reservation for this concert',
        );
      }

      if (concert.availableSeats <= 0) {
        throw new BadRequestException('This concert is fully booked');
      }

      concert.availableSeats -= 1;
      await manager.save(concert);

      const reservation = manager.create(Reservation, {
        user: { id: userId },
        concert: { id: concertId },
        action: ReservationAction.RESERVE,
      });
      await manager.save(reservation);

      return {
        message: 'Seat successfully reserved',
        reservationId: reservation.id,
      };
    });
  }

  async cancel(userId: string, concertId: string) {
    return await this.dataSource.transaction(async (manager) => {
      const concert = await manager.findOne(Concert, {
        where: { id: concertId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!concert) throw new NotFoundException('Concert not found');

      const latestRecord = await manager.findOne(Reservation, {
        where: { user: { id: userId }, concert: { id: concertId } },
        order: { createdAt: 'DESC' },
      });

      if (!latestRecord || latestRecord.action === ReservationAction.CANCEL) {
        throw new NotFoundException(
          'You do not have an active reservation to cancel',
        );
      }

      concert.availableSeats += 1;
      await manager.save(concert);

      const cancelRecord = manager.create(Reservation, {
        user: { id: userId },
        concert: { id: concertId },
        action: ReservationAction.CANCEL,
      });
      await manager.save(cancelRecord);

      return {
        message: 'Reservation successfully canceled',
        cancelRecordId: cancelRecord.id,
      };
    });
  }

  async getUserHistory(userId: string) {
    return await this.reservationRepository.find({
      where: { user: { id: userId } },
      relations: { concert: true, user: true },
      order: { updatedAt: 'DESC' },
    });
  }

  async getAllReservations() {
    return await this.reservationRepository.find({
      relations: { user: true, concert: true },
      order: { createdAt: 'DESC' },
    });
  }
}
