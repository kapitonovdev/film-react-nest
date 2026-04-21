import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsISO8601,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class OrderTicketDto {
  @IsUUID('4')
  film: string;

  @IsUUID('4')
  session: string;

  @IsISO8601()
  daytime: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  row: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  seat: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  price: number;
}

export class CreateOrderDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderTicketDto)
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
