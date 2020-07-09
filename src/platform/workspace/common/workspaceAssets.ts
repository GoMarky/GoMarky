import { Event } from '@/base/common/event';
import { WorkspaceLabel } from '@/platform/geojson/common/geojson';
import { RawAttribute } from '@/platform/attributes/electron-browser/attributes';

export interface IWorkspaceAssetsService {
  //#region Labels

  readonly labels: WorkspaceLabel[];

  readonly onLabelAdded: Event<ILabelAddedEvent>;
  readonly onLabelRemoved: Event<void>;
  readonly onLabelChanged: Event<ILabelChangeEvent>;

  addLabel(label: WorkspaceLabel): boolean;
  removeLabel(label: WorkspaceLabel): void;
  updateLabel(label: WorkspaceLabel): boolean;

  //#endregion

  //#region Attributes

  readonly attributes: RawAttribute[];

  //#endregion

  loadStorage(): boolean;
}

export interface ILabelAddedEvent {
  label: WorkspaceLabel;
}

export interface ILabelChangeEvent {
  label: WorkspaceLabel;
}
