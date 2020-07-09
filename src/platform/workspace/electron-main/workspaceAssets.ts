import { Disposable } from '@/base/common/lifecycle';

import {
  ILabelAddedEvent,
  ILabelChangeEvent,
  IWorkspaceAssetsService,
} from '@/platform/workspace/common/workspaceAssets';

import {
  ILabelGeoJSONProperties,
  IWorkspace,
  IWorkspaceAssetsStorage,
} from '@/platform/workspace/common/workspace';

import { FeatureCollection } from '@/base/geojson';
import { Emitter, Event } from '@/base/common/event';

import {
  ILifecycleService,
  LifecycleMainPhase,
} from '@/platform/lifecycle/electron-main/lifecycle';

import { IStateService } from '@/platform/state/common/state';
import { SingleStorage } from '@/platform/storage/electron-main/storage';
import { WorkspaceLabel } from '@/platform/geojson/common/geojson';

import path from 'path';
import product from '@/platform/product/node';
import { getDefaultLabelCollection } from '@/platform/geojson/electron-main/geojson';
import { RawAttribute } from '@/platform/attributes/electron-browser/attributes';

export class WorkspaceAssetsService extends Disposable implements IWorkspaceAssetsService {
  private _labels: Map<string, WorkspaceLabel> = new Map();
  private _attributes: Map<string, RawAttribute> = new Map();

  private readonly _storage: SingleStorage<IWorkspaceAssetsStorage>;

  private _onLabelAdded = new Emitter<ILabelAddedEvent>();
  public readonly onLabelAdded: Event<ILabelAddedEvent> = this._onLabelAdded.event;

  private _onLabelRemoved = new Emitter<void>();
  public readonly onLabelRemoved: Event<void> = this._onLabelRemoved.event;

  private _onLabelChanged = new Emitter<ILabelChangeEvent>();
  public readonly onLabelChanged: Event<ILabelChangeEvent> = this._onLabelChanged.event;

  constructor(
    @ILifecycleService private readonly lifecycleService: ILifecycleService,
    @IStateService private readonly stateService: IStateService,
    private readonly workspace: IWorkspace
  ) {
    super();

    this._storage = new SingleStorage<IWorkspaceAssetsStorage>({
      schema: {
        labels: { type: 'object', default: getDefaultLabelCollection() },
        attributes: { type: 'array', default: [] },
      },
      name: 'assets',
      cwd: path.join(workspace.uri.path, product.metaFolderName),
    });

    this.loadStorage();

    this.lifecycleService.when(LifecycleMainPhase.AfterWindowOpen).then(() => {
      this.registerListeners();
    });
  }

  private get storage(): SingleStorage<IWorkspaceAssetsStorage> {
    return this._storage;
  }

  public get labels(): WorkspaceLabel[] {
    return Array.from(this._labels.values());
  }

  public addLabel(label: WorkspaceLabel): boolean {
    if (this._labels.has(label.properties.label_title)) {
      return false;
    }

    this._labels.set(label.properties.label_title, label);
    this._onLabelAdded.fire({ label });
    this.saveStorage();

    return true;
  }

  public removeLabel(label: WorkspaceLabel): void {
    this._labels.delete(label.properties.label_title);
    this._onLabelRemoved.fire();
    this.saveStorage();
  }

  public updateLabel(label: WorkspaceLabel): boolean {
    if (this._labels.has(label.properties.label_title)) {
      this._labels.set(label.properties.label_title, label);
      this._onLabelChanged.fire({ label });
      this.saveStorage();

      return true;
    }

    return false;
  }

  public get attributes(): RawAttribute[] {
    return Array.from(this._attributes.values());
  }

  public loadStorage(): boolean {
    const labels: FeatureCollection<null, ILabelGeoJSONProperties> = this.storage.get('labels');

    if (!this.validateLabels(labels)) {
      // invalid labels (incorrect json)
      return false;
    }

    for (const label of labels.features) {
      const { label_title } = label.properties;

      if (this._labels.has(label_title)) {
        // duplicate label ?
        continue;
      }

      this._labels.set(label_title, label);
    }

    const attributes: RawAttribute[] = this._storage.get('attributes');

    for (const attribute of attributes) {
      this._attributes.set(attribute.name, attribute);
    }

    return true;
  }

  private saveStorage(): void {
    const { labels, attributes } = this;

    try {
      this.storage.set('labels', { type: 'FeatureCollection', features: labels });
      this.storage.set('attributes', attributes);
    } catch (error) {
      console.warn(error);
    }
  }

  private validateLabels(_labels: FeatureCollection<null, ILabelGeoJSONProperties>): boolean {
    return true;
  }

  private registerListeners(): void {
    this.lifecycleService.onBeforeShutdown(() => {
      this.saveStorage();
    });
  }
}
