import { Controller, Get, HttpCode, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { API, API_SUB, CONTROLLERS_INFO, ID_PARAM } from '@infra/shared';
import { SyncRunDto, SyncSummaryDto } from './dto/sync.dto';
import { SyncService } from './sync.service';

@ApiBearerAuth()
@ApiTags(CONTROLLERS_INFO.SYNC.TAG)
@Controller(API.PROVIDERS)
export class SyncController {
  constructor(private readonly sync: SyncService) {}

  // Declared before ':uuid/sync' so the static path isn't captured as a uuid.
  @Post(API_SUB.PROVIDER_SYNC_ALL)
  @HttpCode(200)
  @ApiOperation({ summary: 'Sync all providers' })
  @ApiOkResponse({ type: SyncSummaryDto })
  triggerAll() {
    return this.sync.syncAll();
  }

  @Post(API_SUB.PROVIDER_SYNC)
  @HttpCode(200)
  @ApiOperation({ summary: 'Trigger provider sync' })
  @ApiOkResponse({ type: SyncRunDto })
  trigger(@Param(ID_PARAM, ParseUUIDPipe) uuid: string) {
    return this.sync.syncProvider(uuid);
  }

  @Get(API_SUB.PROVIDER_SYNC_RUNS)
  @ApiOperation({ summary: 'List provider sync runs' })
  @ApiOkResponse({ type: [SyncRunDto] })
  syncRuns(@Param(ID_PARAM, ParseUUIDPipe) uuid: string) {
    return this.sync.listSyncRuns(uuid);
  }
}
