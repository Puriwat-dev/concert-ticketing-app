import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationsService } from './reservations.service';

interface RequestWithUser extends ExpressRequest {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

@Controller('reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @Roles(UserRole.USER)
  reserve(
    @Request() req: RequestWithUser,
    @Body() createReservationDto: CreateReservationDto,
  ) {
    return this.reservationsService.reserve(
      req.user.userId,
      createReservationDto,
    );
  }

  @Get('history')
  @Roles(UserRole.USER)
  getUserHistory(@Request() req: RequestWithUser) {
    return this.reservationsService.getUserHistory(req.user.userId);
  }

  @Delete(':id')
  @Roles(UserRole.USER)
  cancel(@Request() req: RequestWithUser, @Param('id') reservationId: string) {
    return this.reservationsService.cancel(req.user.userId, reservationId);
  }

  @Get('audit')
  @Roles(UserRole.ADMIN)
  getAllReservations() {
    return this.reservationsService.getAllReservations();
  }
}
