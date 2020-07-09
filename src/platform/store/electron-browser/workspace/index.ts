import { Module, Mutation, VuexModule } from 'vuex-module-decorators';
import store from '../index';

import { IWorkspaceData } from '@/platform/workspace/common/workspace';

import { URI } from '@/base/common/uri';
import { WorkspaceLabel } from '@/platform/geojson/common/geojson';

import {
  ISerializedWorkspaceDocument,
  IWorkspaceDocument,
} from '@/code/electron-browser/document/common/workspaceDocument';
import { ISerializedWorkspacePage, IWorkspacePage } from '@/code/electron-browser/page/common/page';

export interface IWorkspaceState {
  workspace: IWorkspaceData;
  workspaceLabels: WorkspaceLabel[];
  documents: ISerializedWorkspaceDocument[];

  currentEditedLabel: WorkspaceLabel | null;
  currentDocument: ISerializedWorkspaceDocument | null;
  currentWorkspacePage: ISerializedWorkspacePage | null;

  mSetCurrentEditLabel(label: WorkspaceLabel | null): void;
  mSetWorkspaceLabels(labels: WorkspaceLabel[]): void;

  mSetCurrentDocument(document: IWorkspaceDocument): void;
  mSetDocuments(documents: IWorkspaceDocument[]): void;

  mSetCurrentWorkspacePage(page: IWorkspacePage): void;
}

@Module({ namespaced: true, dynamic: true, store, name: 'workspace' })
export class WorkspaceModule extends VuexModule implements IWorkspaceState {
  public workspace: IWorkspaceData = {
    id: '',
    configuration: { lastEditedTexture: URI.empty() },
    description: '',
    name: '',
    uri: URI.empty(),
  };
  public currentEditedLabel: WorkspaceLabel | null = null;

  public workspaceLabels: WorkspaceLabel[] = [];

  public currentDocument: ISerializedWorkspaceDocument | null = null;
  public documents: ISerializedWorkspaceDocument[] = [];

  public currentWorkspacePage: ISerializedWorkspacePage | null = null;

  @Mutation
  public mSetCurrentWorkspacePage(page: IWorkspacePage): void {
    this.currentWorkspacePage = page.toJSON();
  }

  @Mutation
  public mSetWorkspaceLabels(labels: WorkspaceLabel[]): void {
    this.workspaceLabels = labels;
  }

  @Mutation
  public mSetDocuments(documents: IWorkspaceDocument[]): void {
    this.documents = documents.map(document => document.toJSON());
  }

  @Mutation
  public mSetCurrentDocument(document: IWorkspaceDocument): void {
    this.currentDocument = document.toJSON();
  }

  @Mutation
  public mSetCurrentEditLabel(label: WorkspaceLabel | null): void {
    this.currentEditedLabel = label;
  }
}
