import { CurrentLayerProperty, MaskType, ShapeType } from '@/gl/gomarky';
import { ISerializedGroupLayer } from '@/gl/gomarky/core/geometry/layer/common/layerGroup';
import { Layer } from '@/gl/gomarky/core/geometry/layer/layer';
import { LayerGroup } from '@/gl/gomarky/core/geometry/layer/layerGroup';
import { GlobalEvent } from '@/gm/base/common/event';

export interface ISerializedLayer {
  readonly id: string;
  readonly name: string;

  readonly locked: boolean;
  readonly hidden: boolean;
  readonly selected: boolean;

  readonly mask: MaskType | null;
  readonly parent: ISerializedGroupLayer | undefined;

  readonly instance: Layer;
}

export interface IRootLayerHooks {
  onAddLayer(layer: Layer): void;
  onRemoveLayer(layer: Layer): void;
  onUpdateLayer(layer: Layer): void;
}

export interface ILayerHooks {
  onUpdateLayer(layer: Layer | LayerGroup): void;
}

export enum CreateGeometryPreventReason {
  Invalid = 'Invalid',
}

export class BeforeLayerAppendEvent extends GlobalEvent<CreateGeometryPreventReason> {
  constructor(
    public readonly type: ShapeType,
    public readonly startEvent?: PIXI.interaction.InteractionEvent
  ) {
    super();
  }
}

export class CurrentLayerSetEvent extends GlobalEvent {
  constructor(public readonly layer: CurrentLayerProperty) {
    super();
  }
}
