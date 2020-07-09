/*---------------------------------------------------------------------------------------------
 * Рабочее пространство gomarky
 *--------------------------------------------------------------------------------------------*/

import { ILogService } from '@/platform/log/common/log';
import { SingleStorage } from '@/platform/storage/electron-main/storage';
import { ILocalWorkspaceStorageSchema } from '@/platform/storage/common/schema';

import { Disposable } from '@/base/common/lifecycle';
import { IWorkspace, IWorkspaceData } from '@/platform/workspace/common/workspace';
import { URI } from '@/base/common/uri';

import { IStateService } from '@/platform/state/common/state';

import { ILifecycleService } from '@/platform/lifecycle/electron-main/lifecycle';
import { WorkspaceAssetsService } from '@/platform/workspace/electron-main/workspaceAssets';
import { IWorkspaceAssetsService } from '@/platform/workspace/common/workspaceAssets';

export class Workspace extends Disposable implements IWorkspace {
  private readonly _labelService: IWorkspaceAssetsService;

  constructor(
    @ILogService private readonly logService: ILogService,
    @ILifecycleService private readonly lifecycleService: ILifecycleService,
    @IStateService private readonly stateService: IStateService,
    private readonly _storage: SingleStorage<ILocalWorkspaceStorageSchema>,
    public readonly uri: URI,
    private readonly _id: string
  ) {
    super();

    this._labelService = new WorkspaceAssetsService(lifecycleService, stateService, this);
  }

  public get storage(): SingleStorage<ILocalWorkspaceStorageSchema> {
    return this._storage;
  }

  public get assets(): IWorkspaceAssetsService {
    return this._labelService;
  }

  public get id(): string {
    return this._id;
  }

  public setName(name: string): void {
    return this._storage.set('name', name);
  }

  public setDescription(description: string): void {
    return this._storage.set('description', description);
  }

  public toJSON(): IWorkspaceData {
    const description = this._storage.get('description');
    const name = this._storage.get('name');
    const lastEdit = this._storage.get('lastEditedTexture');

    const lastEditedTexture = URI.file(lastEdit);

    return {
      id: this.id,
      configuration: { lastEditedTexture },
      description,
      name,
      uri: this.uri,
    };
  }

  public [Symbol.toPrimitive](hint: string) {
    if (hint !== 'string') {
      return;
    }

    return JSON.stringify(this.toJSON());
  }
}
