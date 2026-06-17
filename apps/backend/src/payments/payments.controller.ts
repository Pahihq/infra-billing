import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { API, API_SUB, ID_PARAM } from '@infra/shared';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, PaymentQueryDto } from './dto/payment.dto';

@Controller(API.PAYMENTS)
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Get()
  list(@Query() query: PaymentQueryDto) {
    return this.payments.list(query);
  }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreatePaymentDto) {
    return this.payments.create(dto);
  }

  @Delete(API_SUB.BY_ID)
  @HttpCode(204)
  remove(@Param(ID_PARAM, ParseUUIDPipe) uuid: string) {
    return this.payments.remove(uuid);
  }
}
