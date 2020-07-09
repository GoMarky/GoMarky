import { Disposable } from '@/base/common/lifecycle';
import { ISerializedWorkspacePage, IWorkspacePage } from '@/code/electron-browser/page/common/page';

import { URI } from '@/base/common/uri';
import { IWorkspaceDocument } from '@/code/electron-browser/document/common/workspaceDocument';
import { generateUuid } from '@/base/common/uuid';

import { IStoreService } from '@/platform/store/common/storeService';
import { IWorkspaceState } from '@/platform/store/electron-browser/workspace';
import { ILogService } from '@/platform/log/common/log';

export class WorkspacePage extends Disposable implements IWorkspacePage {
  public readonly id: string;
  private _workspaceStore: IWorkspaceState;

  constructor(
    public readonly resource: URI,
    private readonly _resourceData: URI,
    public readonly name: string,
    public readonly parent: IWorkspaceDocument,
    @ILogService private readonly logService: ILogService,
    @IStoreService storeService: IStoreService
  ) {
    super();

    this._workspaceStore = storeService.getModule<IWorkspaceState>('workspace');

    this.id = generateUuid();
  }

  private _selected = false;
  public get selected(): boolean {
    return this._selected;
  }
  public async select(): Promise<this> {
    if (this.parent.selectedPage === this && this._selected) {
      return this;
    }

    await this.parent.selectedPage?.unselect();

    this._selected = true;

    return this;
  }

  public async unselect(): Promise<this> {
    this._selected = false;

    return this;
  }

  public get resourceData(): URI {
    return this._resourceData;
  }

  private async save(): Promise<this> {
    return this;
  }

  public toJSON(): ISerializedWorkspacePage {
    const { id, name,  resource, selected } = this;

    const serialized = {
      id,
      name,
      selected,
      resource,
    };

    Object.defineProperty(serialized, 'instance', { configurable: false, value: this });

    return serialized as ISerializedWorkspacePage;
  }
}
