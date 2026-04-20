import { Body, Controller, Post } from '@nestjs/common';

import { CreateOrderDto, OrderResponseDto } from './dto/order.dto';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('order')
  create(@Body() createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    return this.orderService.create(createOrderDto);
  }
}
