import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsController } from './concerts.controller';
import { ConcertsService } from './concerts.service';

describe('ConcertsController', () => {
  let controller: ConcertsController;
  let service: ConcertsService;

  const mockConcertsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConcertsController],
      providers: [
        {
          provide: ConcertsService,
          useValue: mockConcertsService,
        },
      ],
    }).compile();

    controller = module.get<ConcertsController>(ConcertsController);
    service = module.get<ConcertsService>(ConcertsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call concertsService.create and return the result', async () => {
      const dto = {
        name: 'Test Concert',
        description: 'Test',
        totalSeats: 100,
      };
      const expectedResult = { id: '1', ...dto, availableSeats: 100 };
      mockConcertsService.create.mockResolvedValue(expectedResult);

      expect(await controller.create(dto)).toEqual(expectedResult);
      expect(mockConcertsService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of concerts', async () => {
      const expectedResult = [{ id: '1', name: 'Concert 1' }];
      mockConcertsService.findAll.mockResolvedValue(expectedResult);

      expect(await controller.findAll()).toEqual(expectedResult);
      expect(mockConcertsService.findAll).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should call concertsService.remove and return the result', async () => {
      const expectedResult = { message: 'Concert successfully deleted' };
      mockConcertsService.remove.mockResolvedValue(expectedResult);

      expect(await controller.remove('1')).toEqual(expectedResult);
      expect(mockConcertsService.remove).toHaveBeenCalledWith('1');
    });
  });
});
