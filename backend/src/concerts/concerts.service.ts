import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateConcertDto } from './dto/create-concert.dto';
import { Concert } from './entities/concert.entity';

@Injectable()
export class ConcertsService {
  constructor(
    @InjectRepository(Concert)
    private readonly concertRepository: Repository<Concert>,
  ) {}

  async create(createConcertDto: CreateConcertDto) {
    const concert = this.concertRepository.create(createConcertDto);
    return await this.concertRepository.save(concert);
  }

  async findAll() {
    return await this.concertRepository.find();
  }

  async remove(id: string) {
    const concert = await this.concertRepository.findOne({ where: { id } });
    if (!concert) {
      throw new NotFoundException(`Concert with ID ${id} not found`);
    }

    await this.concertRepository.remove(concert);
    return { message: `Concert ${id} successfully deleted` };
  }
}
