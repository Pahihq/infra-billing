import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { API, API_SUB, ID_PARAM } from '@infra/shared';
import { ServicesService } from './services.service';
import { CreateServiceDto, ServiceQueryDto, UpdateServiceDto } from './dto/service.dto';

@Controller(API.SERVICES)
export class ServicesController {
  constructor(private readonly services: ServicesService) {}

  @Get()
  list(@Query() query: ServiceQueryDto) {
    return this.services.list(query);
  }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateServiceDto) {
    return this.services.create(dto);
  }

  @Patch(API_SUB.BY_ID)
  update(@Param(ID_PARAM, ParseUUIDPipe) uuid: string, @Body() dto: UpdateServiceDto) {
    return this.services.update(uuid, dto);
  }

  @Delete(API_SUB.BY_ID)
  @HttpCode(204)
  remove(@Param(ID_PARAM, ParseUUIDPipe) uuid: string) {
    return this.services.remove(uuid);
  }
}
