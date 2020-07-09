import { createDecorator } from '@/platform/instantiation/common/instantiation';
import { Disposable } from '@/base/common/lifecycle';
import { IMainProcessService } from '@/platform/ipc/electron-browser/mainProcessService';

import { IEnvironmentService } from '@/platform/env/common/environment';
import { IChannel } from '@/base/parts/ipc/common/ipc';
import { RawAttribute } from '@/platform/attributes/electron-browser/attributes';

export interface IWorkspaceAttributesManager {
  addAttribute(): void;
  removeAttribute(): void;
  updateAttribute(): void;

  loadAttributes(): Promise<RawAttribute[]>;
}

export const IWorkspaceAttributesManager = createDecorator<IWorkspaceAttributesManager>(
  'workspaceAttributes'
);

export class WorkspaceAttributesManager extends Disposable implements IWorkspaceAttributesManager {
  private channel: IChannel;

  constructor(
    @IMainProcessService mainProcessService: IMainProcessService,
    @IEnvironmentService private readonly environmentService: IEnvironmentService
  ) {
    super();

    this.channel = mainProcessService.getChannel(
      `workspace:${this.environmentService.configuration.openedWorkspace.id}`
    );
  }

  public addAttribute(): void {
    //
  }
  public removeAttribute(): void {
    //
  }
  public updateAttribute(): void {
    //
  }

  public loadAttributes(): Promise<RawAttribute[]> {
    return this.channel.call('loadAttributes');
  }

  public serviceBrand = IWorkspaceAttributesManager;
}
