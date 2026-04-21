import {
  Body,
  Controller,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';

import { CreateOrderDto, OrderResponseDto } from './dto/order.dto';
import { NormalizeOrderBodyPipe } from './normalize-order-body.pipe';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('order')
  create(
    @Body(
      new NormalizeOrderBodyPipe(),
      new ValidationPipe({
        transform: true,
        whitelist: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    payload: CreateOrderDto,
  ): Promise<OrderResponseDto> {
    return this.orderService.create(payload);
  }
}
