import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { FilmsRepository } from '../repository/films.repository';
import {
  CreateOrderDto,
  OrderedTicketDto,
  OrderResponseDto,
} from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async create(createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    this.validateOrder(createOrderDto);

    const [firstTicket] = createOrderDto.tickets;
    const schedule = await this.filmsRepository.getFilmSession(
      firstTicket.film,
      firstTicket.session,
    );

    if (!schedule) {
      throw new NotFoundException({ error: 'Film session was not found' });
    }

    const seatKeys = createOrderDto.tickets.map(
      ({ row, seat }) => `${row}:${seat}`,
    );
    const alreadyTaken = seatKeys.find((seatKey) =>
      schedule.taken.includes(seatKey),
    );

    if (alreadyTaken) {
      throw new BadRequestException({
        error: `Seat ${alreadyTaken} has already been taken`,
      });
    }

    createOrderDto.tickets.forEach((ticket) => {
      if (
        ticket.row < 1 ||
        ticket.row > schedule.rows ||
        ticket.seat < 1 ||
        ticket.seat > schedule.seats
      ) {
        throw new BadRequestException({
          error: `Seat ${ticket.row}:${ticket.seat} is out of range`,
        });
      }
    });

    await this.filmsRepository.reserveSeats(
      firstTicket.film,
      firstTicket.session,
      seatKeys,
    );

    const items: OrderedTicketDto[] = createOrderDto.tickets.map((ticket) => ({
      ...ticket,
      id: randomUUID(),
    }));

    return {
      total: items.length,
      items,
    };
  }

  private validateOrder(createOrderDto: CreateOrderDto): void {
    if (!createOrderDto.email?.trim()) {
      throw new BadRequestException({ error: 'Email is required' });
    }

    if (!createOrderDto.phone?.trim()) {
      throw new BadRequestException({ error: 'Phone is required' });
    }

    if (
      !Array.isArray(createOrderDto.tickets) ||
      createOrderDto.tickets.length === 0
    ) {
      throw new BadRequestException({
        error: 'At least one ticket is required',
      });
    }

    const filmIds = new Set(createOrderDto.tickets.map(({ film }) => film));
    const sessionIds = new Set(
      createOrderDto.tickets.map(({ session }) => session),
    );

    if (filmIds.size > 1 || sessionIds.size > 1) {
      throw new BadRequestException({
        error: 'All tickets must belong to the same film session',
      });
    }

    const seatKeys = createOrderDto.tickets.map(
      ({ row, seat }) => `${row}:${seat}`,
    );
    const uniqueSeatKeys = new Set(seatKeys);

    if (uniqueSeatKeys.size !== seatKeys.length) {
      throw new BadRequestException({
        error: 'The same seat cannot be booked twice in one request',
      });
    }
  }
}
