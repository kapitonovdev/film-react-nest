import { BadRequestException, NotFoundException } from '@nestjs/common';

import { CreateOrderDto } from './dto/order.dto';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: jest.Mocked<Pick<OrderService, 'create'>>;

  const ticket = {
    film: '7a151dbc-6b69-4684-aa3f-5ff77cacb921',
    session: 'b0cd1fa6-51f0-4b6c-b90d-86b16f98e903',
    daytime: '2026-05-08T12:00:00.000Z',
    row: 1,
    seat: 2,
    price: 350,
  };

  beforeEach(() => {
    orderService = {
      create: jest.fn(),
    };
    controller = new OrderController(orderService as unknown as OrderService);
  });

  describe('.create', () => {
    it('should pass order payload to OrderService and return created tickets', async () => {
      const payload: CreateOrderDto = {
        email: 'user@example.com',
        phone: '+375291234567',
        tickets: [ticket],
      };
      const response = {
        total: 1,
        items: [
          {
            ...ticket,
            id: 'a5dfe882-f33f-4204-96b3-422fd40611ca',
          },
        ],
      };
      orderService.create.mockResolvedValue(response);

      await expect(controller.create(payload)).resolves.toBe(response);
      expect(orderService.create).toHaveBeenCalledWith(payload);
    });

    it('should propagate not found errors from OrderService', async () => {
      const payload: CreateOrderDto = {
        tickets: [ticket],
      };
      const error = new NotFoundException({
        error: 'Film session was not found',
      });
      orderService.create.mockRejectedValue(error);

      await expect(controller.create(payload)).rejects.toBe(error);
    });

    it('should propagate bad request errors from OrderService', async () => {
      const payload: CreateOrderDto = {
        tickets: [ticket],
      };
      const error = new BadRequestException({
        error: 'Seat 1:2 has already been taken',
      });
      orderService.create.mockRejectedValue(error);

      await expect(controller.create(payload)).rejects.toBe(error);
    });
  });
});
