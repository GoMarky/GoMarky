import { Disposable } from '@/base/common/lifecycle';
import { IWorkspacesService } from '@/platform/workspaces/common/workspaces';
import {
  IWorkspace,
  IWorkspaceCreationOptions,
  IWorkspaceId,
} from '@/platform/workspace/common/workspace';

import { ILogService } from '@/platform/log/common/log';
import { ILifecycleService } from '@/platform/lifecycle/electron-main/lifecycle';
import { IStateService } from '@/platform/state/common/state';

import { IWorkspacesMainService } from '@/platform/workspaces/electron-main/workspacesMainService';
import { IHistoryMainService } from '@/platform/history/common/history';

export class WorkspacesService extends Disposable implements IWorkspacesService {
  constructor(
    @IWorkspacesMainService private readonly workspacesMainService: IWorkspacesMainService,
    @ILogService private readonly logService: ILogService,
    @ILifecycleService private readonly lifecycleService: ILifecycleService,
    @IStateService private readonly stateService: IStateService,
    @IHistoryMainService private readonly historyMainService: IHistoryMainService
  ) {
    super();
  }

  public createUntitledWorkspace(options: IWorkspaceCreationOptions): Promise<IWorkspace> {
    return this.workspacesMainService.createUntitledWorkspace(options);
  }

  public getWorkspaceById(identifier: IWorkspaceId): Promise<IWorkspace> {
    return this.workspacesMainService.getWorkspaceById(identifier);
  }

  public setLastEditedTexture(workspaceId: IWorkspaceId, path: string): Promise<void> {
    return this.withWorkspace(workspaceId, (workspace: IWorkspace) => {
      const storage = workspace.storage;

      storage.set('lastEditedTexture', path);
    });
  }

  public getLastEditedTexture(workspaceId: IWorkspaceId): Promise<string | undefined> {
    return this.withWorkspace<string | undefined>(workspaceId, workspace => {
      const storage = workspace.storage;

      const lastEditedTexturePath = storage.get('lastEditedTexture', '');

      return lastEditedTexturePath;
    });
  }

  private async withWorkspace<T>(
    workspaceId: IWorkspaceId,
    fn: (workspace: IWorkspace) => T,
    fallback?: () => T
  ): Promise<T | undefined> {
    const workspace = await this.workspacesMainService.getWorkspaceById(workspaceId);

    if (workspace) {
      return fn(workspace);
    }
    if (fallback) {
      return fallback();
    }

    return undefined;
  }
}
