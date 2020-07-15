import { LayerGroup } from '@/gl/gomarky';
import { ISerializedLayer } from '@/gl/gomarky/core/geometry/layer/common/layer';
import { Layer } from '@/gl/gomarky/core/geometry/layer/layer';

export type CommonLayer = Layer | LayerGroup;

export type CommonSerializedLayer = ISerializedLayer | ISerializedGroupLayer;

export interface ISerializedGroupLayer extends ISerializedLayer {
  layers: CommonSerializedLayer[];
}
