import { Controller, Get, HttpCode, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { API, API_SUB, ID_PARAM } from '@infra/shared';
import { SyncService } from './sync.service';

@Controller(API.PROVIDERS)
export class SyncController {
  constructor(private readonly sync: SyncService) {}

  // Declared before ':uuid/sync' so the static path isn't captured as a uuid.
  @Post(API_SUB.PROVIDER_SYNC_ALL)
  @HttpCode(200)
  triggerAll() {
    return this.sync.syncAll();
  }

  @Post(API_SUB.PROVIDER_SYNC)
  @HttpCode(200)
  trigger(@Param(ID_PARAM, ParseUUIDPipe) uuid: string) {
    return this.sync.syncProvider(uuid);
  }

  @Get(API_SUB.PROVIDER_SYNC_RUNS)
  syncRuns(@Param(ID_PARAM, ParseUUIDPipe) uuid: string) {
    return this.sync.listSyncRuns(uuid);
  }
}
