import { joinPath, URI } from '@/base/common/uri';
import { createDecorator } from '@/platform/instantiation/common/instantiation';
import { Barrier } from '@/base/common/async';

import { WorkspaceLabel } from '@/platform/geojson/common/geojson';
import * as path from 'path';
import { IFileStatWithMetadata } from '@/platform/files/common/files';

import { IPCChannelError } from '@/platform/ipc/common/ipc';
import { SingleStorage } from '@/platform/storage/electron-main/storage';
import { ILocalWorkspaceStorageSchema } from '@/platform/storage/common/schema';

import { IWorkspaceDocument } from '@/code/electron-browser/document/common/workspaceDocument';
import {
  ILabelAddedEvent,
  IWorkspaceAssetsService,
} from '@/platform/workspace/common/workspaceAssets';
import { RawAttribute } from '@/platform/attributes/electron-browser/attributes';

export interface IWorkspaceAssetsStorage {
  labels: WorkspaceLabel[];
  attributes: RawAttribute[];
}

export interface IWorkspaceFolderData {
  readonly uri: URI;
  readonly name: string;
}

export interface IWorkspaceDatasetFolderData extends IWorkspaceFolderData {
  images: URI[];
  randomImage: URI | undefined | null;
}

export type IWorkspaceId = string;
export type CurrentOpenDataset = IFileStatWithMetadata;

export interface IWorkspaceFolder extends IWorkspaceFolderData {
  toResource(relativePath: string): URI;
}

export interface IWorkspaceFoldersChangeEvent {
  added: IWorkspaceFolder[];
  removed: IWorkspaceFolder[];
  changed: IWorkspaceFolder[];
}

export interface IWorkspaceLabelsChangeEvent {
  added: ILabelAddedEvent;
}

export interface IRawFileWorkspaceFolder {
  path: string;
  name?: string;
}

export interface IRawUriWorkspaceFolder {
  uri: string;
  name?: string;
}

export type IStoredWorkspaceFolder = IRawFileWorkspaceFolder | IRawUriWorkspaceFolder;

export class IPCWorkspaceChannelError extends IPCChannelError {
  public readonly name = 'IPCWorkspaceChannelError';
}

export interface ILabelGeoJSONProperties {
  label_title: string;
  fill_color: string;

  label_description?: string;
  keyCode?: string;
}

export interface IWorkspaceConfiguration {
  lastEditedTexture: URI;
}

export interface IWorkspace {
  readonly id: string;
  readonly uri: URI;

  setName(name: string): void;
  setDescription(description: string): void;
  toJSON(): IWorkspaceData;

  readonly storage: SingleStorage<ILocalWorkspaceStorageSchema>;
  readonly assets: IWorkspaceAssetsService;
}

export const enum WorkbenchState {
  EMPTY = 1,
  FOLDER,
  WORKSPACE,
}

export type WorkspaceBase = Omit<IWorkspace, 'uri' | 'storage' | 'toJSON' | 'assets'>;

export interface IWorkspaceData {
  id: string;
  configuration: IWorkspaceConfiguration;
  name: string;
  uri: URI;
  description: string;
}

export interface IWorkspaceCreationOptions {
  name?: string;
  description?: string;
  location: URI;
}

export interface ICreateWorkspaceDatasetOptions {
  name: string;
  location: URI;
  description?: string;
}

export interface IWorkspaceContextService {
  readonly loadWorkspaceBarrier: Barrier;
  readonly workspace: IWorkspaceRenderer;

  setLastEditedTexture(path: string): Promise<void>;
  getLastEditedTexture(): Promise<URI | null>;
}

export interface IWorkspaceRenderer extends WorkspaceBase {
  readonly resource: URI;
  readonly id: string;

  selectedDocument: IWorkspaceDocument;
  documents: IWorkspaceDocument[];

  addLabel(label: WorkspaceLabel): Promise<boolean>;
  removeLabel(label: WorkspaceLabel): Promise<boolean>;
  updateLabel(label: WorkspaceLabel): Promise<boolean>;

  loadWorkspaceLabels(): Promise<WorkspaceLabel[]>;

  setDescription(description: string): Promise<void>;
  setName(name: string): Promise<void>;
}

export const IWorkspaceContextService = createDecorator<IWorkspaceContextService>(
  'workspaceContextService'
);

export function resolveWorkspaceFolder(resource: URI): URI {
  return URI.file(path.resolve(resource.path, '..', '..'));
}

export function resolveAnnotationPath(image: URI): URI {
  return joinPath(resolveWorkspaceFolder(image), 'ann');
}

export function resolveImagePath(ann: URI): URI {
  return joinPath(resolveWorkspaceFolder(ann), 'media');
}
