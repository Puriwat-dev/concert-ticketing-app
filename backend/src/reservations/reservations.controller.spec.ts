import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Reservation, ReservationAction } from './entities/reservation.entity';
import { ReservationsService } from './reservations.service';

describe('ReservationsService', () => {
  let service: ReservationsService;

  const mockEntityManager = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockDataSource = {
    transaction: jest.fn().mockImplementation((cb) => cb(mockEntityManager)),
  };

  const mockReservationRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: getRepositoryToken(Reservation),
          useValue: mockReservationRepository,
        },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
    jest.clearAllMocks();
  });

  describe('reserve', () => {
    it('should successfully reserve a seat', async () => {
      const concert = { id: 'concert-1', availableSeats: 5 };

      mockEntityManager.findOne
        .mockResolvedValueOnce(concert)
        .mockResolvedValueOnce(null);

      mockEntityManager.create.mockReturnValue({ id: 'res-1' });

      const result = await service.reserve('user-1', {
        concertId: 'concert-1',
      });

      expect(concert.availableSeats).toBe(4);
      expect(mockEntityManager.save).toHaveBeenCalledTimes(2);
      expect(result).toHaveProperty('reservationId', 'res-1');
    });

    it('should throw BadRequestException if concert is full', async () => {
      const concert = { id: 'concert-1', availableSeats: 0 };

      mockEntityManager.findOne
        .mockResolvedValueOnce(concert)
        .mockResolvedValueOnce(null);

      await expect(
        service.reserve('user-1', { concertId: 'concert-1' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException if user already has an active reservation', async () => {
      const concert = { id: 'concert-1', availableSeats: 5 };
      const existingReservation = { action: ReservationAction.RESERVE };

      mockEntityManager.findOne
        .mockResolvedValueOnce(concert)
        .mockResolvedValueOnce(existingReservation);

      await expect(
        service.reserve('user-1', { concertId: 'concert-1' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('cancel', () => {
    it('should successfully cancel a reservation and return seat to concert', async () => {
      const concert = { id: 'concert-1', availableSeats: 4 };
      const latestRecord = { action: ReservationAction.RESERVE };

      mockEntityManager.findOne
        .mockResolvedValueOnce(concert)
        .mockResolvedValueOnce(latestRecord);

      mockEntityManager.create.mockReturnValue({ id: 'cancel-1' });

      const result = await service.cancel('user-1', 'concert-1');

      expect(concert.availableSeats).toBe(5);
      expect(mockEntityManager.save).toHaveBeenCalledTimes(2);
      expect(result.message).toBe('Reservation successfully canceled');
    });

    it('should throw NotFoundException if no active reservation exists to cancel', async () => {
      const concert = { id: 'concert-1', availableSeats: 4 };

      mockEntityManager.findOne
        .mockResolvedValueOnce(concert)
        .mockResolvedValueOnce(null);

      await expect(service.cancel('user-1', 'concert-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
