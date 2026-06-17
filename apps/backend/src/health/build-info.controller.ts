import { Controller, Get } from '@nestjs/common';
import { API } from '@infra/shared';
import { BuildInfo } from '@infra/shared';
import { AppConfigService } from '@config/app-config.service';
import { Public } from '../auth/public.decorator';

@Controller(API.BUILD_INFO)
export class BuildInfoController {
  constructor(private readonly config: AppConfigService) {}

  /** Build metadata for the in-panel "Build Info" popup. No secrets — public. */
  @Public()
  @Get()
  buildInfo(): BuildInfo {
    return this.config.buildInfo;
  }
}
