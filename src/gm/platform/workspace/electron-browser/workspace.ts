import { Disposable } from '@/gm/base/common/lifecycle';
import {
  IWorkspaceContextService,
  IWorkspaceRenderer,
} from '@/gm/platform/workspace/common/workspace';
import { IEnvironmentService } from '@/gm/platform/env/common/environment';

import { IMainProcessService } from '@/gm/platform/ipc/electron-browser/mainProcessService';
import { IChannel } from '@/gm/base/parts/ipc/common/ipc';
import { ILifecycleService, LifePhase } from '@/gm/platform/lifecycle/common/lifecycle';
import { WorkspaceLabel } from '@/gm/platform/geojson/common/geojson';

import { isEqual, URI } from '@/gm/base/common/uri';
import { IWorkspaceDocument } from '@/gm/code/electron-browser/document/common/workspaceDocument';
import { IFileService } from '@/gm/platform/files/common/files';

import { IInstantiationService } from '@/gm/platform/instantiation/common/instantiation';
import { createWorkspaceDocument } from '@/gm/code/electron-browser/document/electron-browser/workspaceDocument';
import { IStoreService } from '@/gm/platform/store/common/storeService';

import { IWorkspaceState } from '@/gm/platform/store/electron-browser/workspace';

export class Workspace extends Disposable implements IWorkspaceRenderer {
  public id: string;
  public resource: URI;
  private channel: IChannel;

  private _documents: IWorkspaceDocument[] = [];
  private _workspaceStore: IWorkspaceState;

  public get documents(): IWorkspaceDocument[] {
    return this._documents;
  }

  public set documents(documents) {
    this._documents = documents;
    this._workspaceStore.mSetDocuments(documents);
  }

  constructor(
    private readonly workspaceService: IWorkspaceContextService,
    @IInstantiationService private readonly instantiationService: IInstantiationService,
    @IEnvironmentService private readonly environmentService: IEnvironmentService,
    @IStoreService private readonly storeService: IStoreService,
    @ILifecycleService private readonly lifecycleService: ILifecycleService,
    @IFileService private readonly fileService: IFileService,
    @IMainProcessService mainProcessService: IMainProcessService
  ) {
    super();

    this.lifecycleService.when(LifePhase.Ready).then(() => {
      this.id = environmentService.configuration.openedWorkspace.id;
      this.resource = URI.file(environmentService.configuration.openedWorkspace.configPath.path);

      this.channel = mainProcessService.getChannel(`workspace:${this.id}`);
      this._workspaceStore = this.storeService.getModule<IWorkspaceState>('workspace');

      return this.initialize();
    });
  }

  private _selectedDocument: IWorkspaceDocument;
  public get selectedDocument(): IWorkspaceDocument {
    return this._selectedDocument;
  }

  public async selectDocument(document: IWorkspaceDocument): Promise<void> {
    this._selectedDocument = document;
    this._workspaceStore.mSetCurrentDocument(document);
  }

  public setDescription(description: string): Promise<void> {
    return this.channel.call('setDescription', description);
  }

  public setName(name: string): Promise<void> {
    return this.channel.call('setName', name);
  }

  public async loadWorkspaceLabels(): Promise<WorkspaceLabel[]> {
    const labels = await this.channel.call<WorkspaceLabel[]>('loadWorkspaceLabels');
    this._workspaceStore.mSetWorkspaceLabels(labels);

    return labels;
  }

  public addLabel(label: WorkspaceLabel): Promise<boolean> {
    return this.channel.call('addLabel', label);
  }

  public removeLabel(label: WorkspaceLabel): Promise<boolean> {
    return this.channel.call('removeLabel', label);
  }

  public updateLabel(label: WorkspaceLabel): Promise<boolean> {
    return this.channel.call('updateLabel', label);
  }

  private async initialize(): Promise<void> {
    const { resource } = this;

    await this.loadWorkspaceLabels();

    if (this.environmentService.shouldActivateGlCore) {
      return this.doInitialize(resource);
    }
  }

  private async doInitialize(resource: URI): Promise<void> {
    // allow it as non recursive
    const result = await this.fileService.resolve(resource, {
      resolveSingleChildDescendants: true,
    });

    if (!result.children) {
      // no children for workspace found
      return;
    }

    const children = result.children.filter(
      child => child.name !== '.DS_Store' && child.name !== '.gomarky'
    );

    const documents = [];

    for (const { resource } of children) {
      const workspaceDocument = await createWorkspaceDocument(resource, this.instantiationService);
      documents.push(workspaceDocument);
    }

    this.documents = documents;

    const lastEditedTextureResource = await this.workspaceService.getLastEditedTexture();

    if (lastEditedTextureResource) {
      const document = documents.find(document => document.contains(lastEditedTextureResource));

      if (document) {
        await this.selectDocument(document);

        const page = document.pages.find(page =>
          isEqual(page.resource, lastEditedTextureResource, false)
        );

        if (page) {
          await page.select();
          return;
        }
      }
    }

    return this.selectDocument(documents[0]);
  }
}
