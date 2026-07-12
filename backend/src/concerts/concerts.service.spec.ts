import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConcertsService } from './concerts.service';
import { Concert } from './entities/concert.entity';

describe('ConcertsService', () => {
  let service: ConcertsService;

  const mockConcertRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConcertsService,
        {
          provide: getRepositoryToken(Concert),
          useValue: mockConcertRepository,
        },
      ],
    }).compile();

    service = module.get<ConcertsService>(ConcertsService);
    jest.clearAllMocks(); // Clear mocks before each test
  });

  describe('create', () => {
    it('should create a concert and initialize availableSeats', async () => {
      const dto = {
        name: 'Test Concert',
        description: 'Test',
        totalSeats: 100,
      };
      const expectedConcert = { id: '1', ...dto, availableSeats: 100 };

      mockConcertRepository.create.mockReturnValue(expectedConcert);
      mockConcertRepository.save.mockResolvedValue(expectedConcert);

      const result = await service.create(dto);

      expect(mockConcertRepository.create).toHaveBeenCalledWith({
        ...dto,
        availableSeats: 100,
      });
      expect(result).toEqual(expectedConcert);
    });
  });

  describe('remove', () => {
    it('should successfully remove a concert', async () => {
      mockConcertRepository.findOne.mockResolvedValue({
        id: '1',
        name: 'Concert 1',
      });
      mockConcertRepository.remove.mockResolvedValue(undefined);

      const result = await service.remove('1');
      expect(result).toEqual({ message: 'Concert 1 successfully deleted' });
    });

    it('should throw NotFoundException if concert does not exist', async () => {
      mockConcertRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('99')).rejects.toThrow(NotFoundException);
    });
  });
});
