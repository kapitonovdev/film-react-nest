export class OrderTicketDto {
  film: string;
  session: string;
  daytime: string;
  row: number;
  seat: number;
  price: number;
}

export class CreateOrderDto {
  email: string;
  phone: string;
  tickets: OrderTicketDto[];
}

export class OrderedTicketDto extends OrderTicketDto {
  id: string;
}

export class OrderResponseDto {
  total: number;
  items: OrderedTicketDto[];
}

export class ErrorResponseDto {
  error: string;
}
