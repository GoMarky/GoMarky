import { Disposable } from '@/base/common/lifecycle';
import {
  IWorkspaceContextService,
  IWorkspaceRenderer,
} from '@/platform/workspace/common/workspace';

import { Event } from '@/base/common/event';

import { IWorkspacesService } from '@/platform/workspaces/common/workspaces';
import { IEnvironmentService } from '@/platform/env/common/environment';
import { IStoreService } from '@/platform/store/common/storeService';

import { IWorkspaceState } from '@/platform/store/electron-browser/workspace';
import { ILifecycleService, LifePhase } from '@/platform/lifecycle/common/lifecycle';
import { Barrier } from '@/base/common/async';

import { FileOperationEvent, IFileService } from '@/platform/files/common/files';
import { Workspace } from '@/platform/workspace/electron-browser/workspace';
import { IInstantiationService } from '@/platform/instantiation/common/instantiation';

import {
  IWorkspaceAttributesManager,
  WorkspaceAttributesManager,
} from '@/platform/workspace/electron-browser/workspaceAttribute';
import { URI } from '@/base/common/uri';

const DEFAULT_CHANGE_FILE_DELAY = 1000;

export class WorkspaceService extends Disposable implements IWorkspaceContextService {
  private readonly _workspace: IWorkspaceRenderer;
  public readonly loadWorkspaceBarrier: Barrier = new Barrier();
  public readonly serviceBrand = IWorkspaceContextService;

  private workspaceStore: IWorkspaceState;

  public readonly onAfterOperation = Event.debounce<FileOperationEvent>(
    this.fileService._onAfterOperation.event,
    (_: FileOperationEvent | undefined, event: FileOperationEvent) => event,
    DEFAULT_CHANGE_FILE_DELAY
  );

  private _attributesManager: IWorkspaceAttributesManager;

  constructor(
    @IInstantiationService private readonly instantiationService: IInstantiationService,
    @IEnvironmentService private readonly environmentService: IEnvironmentService,
    @IStoreService private readonly storeService: IStoreService,
    @ILifecycleService private readonly lifecycleService: ILifecycleService,
    @IWorkspacesService private readonly workspacesService: IWorkspacesService,
    @IFileService private readonly fileService: IFileService
  ) {
    super();

    this._workspace = this.instantiationService.createInstance(Workspace, this);

    this._attributesManager = this.instantiationService.createInstance(WorkspaceAttributesManager);

    this.lifecycleService.when(LifePhase.Ready).then(async () => {
      this.workspaceStore = this.storeService.getModule<IWorkspaceState>('workspace');
      this.registerListeners();
    });
  }

  public get workspace(): IWorkspaceRenderer {
    return this._workspace;
  }

  public get workspaceId(): string {
    return this.environmentService.configuration.openedWorkspace.id;
  }

  public setLastEditedTexture(path: string): Promise<void> {
    return this.workspacesService.setLastEditedTexture(this.workspaceId, path);
  }

  public async getLastEditedTexture(): Promise<URI | null> {
    const lastEditedTexturePath = await this.workspacesService.getLastEditedTexture(
      this.workspaceId
    );

    if (lastEditedTexturePath && typeof lastEditedTexturePath === 'string') {
      return URI.file(lastEditedTexturePath);
    }

    return null;
  }

  private registerListeners(): void {
    this.onAfterOperation(async () => {
      //
    });
  }
}
