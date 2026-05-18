import { Injectable, PipeTransform } from '@nestjs/common';

import { CreateOrderDto, OrderTicketDto } from './dto/order.dto';

@Injectable()
export class NormalizeOrderBodyPipe
  implements PipeTransform<CreateOrderDto | OrderTicketDto[], CreateOrderDto>
{
  transform(value: CreateOrderDto | OrderTicketDto[]): CreateOrderDto {
    if (Array.isArray(value)) {
      return {
        tickets: value,
      };
    }

    return value;
  }
}
