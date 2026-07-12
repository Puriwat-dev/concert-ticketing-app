import { Test, TestingModule } from '@nestjs/testing';
import { UserRole } from '../users/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should call authService.register', async () => {
      const dto = {
        fullName: 'Putter',
        email: 'test@test.com',
        password: 'password',
      };
      mockAuthService.register.mockResolvedValue({ message: 'Success' });

      expect(await controller.register(dto)).toEqual({ message: 'Success' });

      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should call authService.login with role fallback', async () => {
      const dto = {
        fullName: 'Putter',
        email: 'test@test.com',
        password: 'password',
      };
      mockAuthService.login.mockResolvedValue({ accessToken: 'token' });

      expect(await controller.login(dto, { role: undefined })).toEqual({
        accessToken: 'token',
      });

      expect(mockAuthService.login).toHaveBeenCalledWith(dto, UserRole.USER);
    });

    it('should call authService.login with requested role', async () => {
      const dto = { admin: 'admin@test.com', password: 'password' };
      mockAuthService.login.mockResolvedValue({ accessToken: 'token' });

      expect(await controller.login(dto, { role: UserRole.ADMIN })).toEqual({
        accessToken: 'token',
      });

      expect(mockAuthService.login).toHaveBeenCalledWith(dto, UserRole.ADMIN);
    });
  });
});
