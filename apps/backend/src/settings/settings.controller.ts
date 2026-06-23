import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { API, CONTROLLERS_INFO } from '@infra/shared';
import { SettingsService } from './settings.service';
import { SettingsDto, UpdateSettingsDto } from './dto/settings.dto';

@ApiBearerAuth()
@ApiTags(CONTROLLERS_INFO.SETTINGS.TAG)
@Controller(API.SETTINGS)
export class SettingsController {
  constructor(private readonly settings: SettingsService) {}

  @ApiOperation({ summary: 'Get settings' })
  @ApiOkResponse({ type: SettingsDto })
  @Get()
  get() {
    return this.settings.get();
  }

  @ApiOperation({ summary: 'Update settings' })
  @ApiOkResponse({ type: SettingsDto })
  @Patch()
  update(@Body() dto: UpdateSettingsDto) {
    return this.settings.update(dto);
  }
}
