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
} from '@nestjs/common';
import { API, API_SUB, ID_PARAM } from '@infra/shared';
import { NetcupDeviceFlowService } from '../connectors/netcup/netcup.device-flow';
import { ProvidersService } from './providers.service';
import { CreateProviderDto, NetcupDevicePollDto, UpdateProviderDto } from './dto/provider.dto';

@Controller(API.PROVIDERS)
export class ProvidersController {
  constructor(
    private readonly providers: ProvidersService,
    private readonly netcupDevice: NetcupDeviceFlowService,
  ) {}

  @Get()
  list() {
    return this.providers.list();
  }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateProviderDto) {
    return this.providers.create(dto);
  }

  // netcup OAuth2 device flow — declared before the `:uuid` routes (static path, no collision).
  @Post(API_SUB.PROVIDER_NETCUP_DEVICE_START)
  netcupDeviceStart() {
    return this.netcupDevice.start();
  }

  @Post(API_SUB.PROVIDER_NETCUP_DEVICE_POLL)
  @HttpCode(200)
  netcupDevicePoll(@Body() dto: NetcupDevicePollDto) {
    return this.netcupDevice.poll(dto.deviceCode);
  }

  @Get(API_SUB.BY_ID)
  get(@Param(ID_PARAM, ParseUUIDPipe) uuid: string) {
    return this.providers.getWithServices(uuid);
  }

  @Patch(API_SUB.BY_ID)
  update(@Param(ID_PARAM, ParseUUIDPipe) uuid: string, @Body() dto: UpdateProviderDto) {
    return this.providers.update(uuid, dto);
  }

  @Delete(API_SUB.BY_ID)
  @HttpCode(204)
  remove(@Param(ID_PARAM, ParseUUIDPipe) uuid: string) {
    return this.providers.remove(uuid);
  }
}
