import { IWorkspaceDocument } from '@/code/electron-browser/document/common/workspaceDocument';
import { URI } from '@/base/common/uri';

export interface ISerializedWorkspacePage {
  readonly id: string;
  readonly name: string;
  readonly resource: URI;

  readonly selected: boolean;

  readonly instance: IWorkspacePage;
}

export interface IWorkspacePage {
  readonly id: string;
  readonly name: string;
  readonly resource: URI;

  readonly selected: boolean;

  resourceData: URI;

  readonly parent: IWorkspaceDocument;

  select(): Promise<this>;
  unselect(): Promise<this>;

  toJSON(): ISerializedWorkspacePage;
}
