import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { CreateConcertDto } from './dto/create-concert.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('concerts')
export class ConcertsController {
  constructor(private readonly concertsService: ConcertsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createConcertDto: CreateConcertDto) {
    return this.concertsService.create(createConcertDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.concertsService.findAll();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.concertsService.remove(id);
  }
}
