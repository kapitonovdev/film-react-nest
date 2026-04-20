import { Body, Controller, Post } from '@nestjs/common';

import {
  CreateOrderDto,
  OrderResponseDto,
  OrderTicketDto,
} from './dto/order.dto';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('order')
  create(
    @Body() payload: CreateOrderDto | OrderTicketDto[],
  ): Promise<OrderResponseDto> {
    return this.orderService.create(payload);
  }
}
