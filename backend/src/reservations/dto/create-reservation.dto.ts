import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateReservationDto {
  @IsUUID(4, { message: 'Valid Concert ID is required' })
  @IsNotEmpty()
  concertId!: string;
}
