import { Body, Controller, Post, Query } from '@nestjs/common';
import { UserRole } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginDto, LoginQueryDto, RegisterDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto, @Query() query: LoginQueryDto) {
    const requestedRole = query.role || UserRole.USER;
    return this.authService.login(loginDto, requestedRole);
  }
}
