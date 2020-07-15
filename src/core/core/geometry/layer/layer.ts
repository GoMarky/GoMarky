import { Disposable } from '@/gm/base/common/lifecycle';
import { IWorkspacePage } from '@/gm/code/electron-browser/page/common/page';

import { generateUuid } from '@/gm/base/common/uuid';
import { Container, IApplication, MaskType, Scene } from '@/gl/gomarky';
import { LayerGroup } from '@/gl/gomarky/core/geometry/layer/layerGroup';

import { ISerializedLayer } from '@/gl/gomarky/core/geometry/layer/common/layer';
import { CommonLayer } from '@/gl/gomarky/core/geometry/layer/common/layerGroup';

export enum UpdateTick {
  None,
  RemoveChild,
  AppendChild,
  UpdateChild,
}

export abstract class Layer extends Disposable {
  public readonly id: string = generateUuid();
  public parent: LayerGroup | null;
  public workspacePage: IWorkspacePage;

  public hidden: boolean;
  public locked: boolean;

  public container: Container;

  public _proxy: Layer;
  protected _mask: MaskType | null = null;

  public _selected = false;
  public get selected(): boolean {
    return this._selected;
  }

  public set selected(selected) {
    // select container
    this.container.selected = selected;
    // select layer itself.
    this._selected = selected;

    this.app.scene.drawSelectPreviewShape();
  }

  public get name(): string {
    return this._name;
  }

  public set name(name) {
    this._name = name;
  }

  protected constructor(protected _name: string, protected readonly app: IApplication) {
    super();

    const isRoot = _name === Scene.RootName;

    const rootHook = app.meta.hooks.root;
    const layerHook = app.meta.hooks.layer;

    const proxy_root_handler: ProxyHandler<Layer> = {
      set: (layer, key, value) => {
        (layer as any)[key] = value;

        if (key !== '$didUpdate') {
          return true;
        }

        if (value.type === UpdateTick.AppendChild) {
          const _layer = value?.child;

          if (_layer) {
            rootHook.onAddLayer(_layer);
          }

          return true;
        }

        if (value.type === UpdateTick.RemoveChild) {
          const _layer = value?.child;

          if (_layer) {
            rootHook.onRemoveLayer(_layer);
          }
        }

        return true;
      },
    };
    const proxy_layer_handler: ProxyHandler<LayerGroup | Layer> = {
      set: (layer, key, value) => {
        (layer as any)[key] = value;

        layerHook.onUpdateLayer(layer);

        return true;
      },
    };

    const proxy = new Proxy(this, isRoot ? proxy_root_handler : proxy_layer_handler);

    this._proxy = proxy;

    return proxy;
  }

  public setParent(parent: LayerGroup): this {
    if (this.parent === parent) {
      return this;
    }

    if (this.parent) {
      this.parent.removeChild(this);
    }

    // change parent logic here
    this.parent = parent;

    this.parent.appendChild(this);

    return this;
  }

  public setMask(mask: MaskType): this {
    this._mask = mask;

    return this;
  }

  public abstract duplicate(): Layer;

  public remove(): this {
    if (this.parent) {
      this.container.remove();
      this.parent.removeChild(this);
      this.parent = null;
    }

    if (this.app.scene.currentLayer === this) {
      this.app.scene.setCurrentLayer(null);
    }

    this.app.select.clearBorderShape();

    return this;
  }

  public dispose(): void {
    super.dispose();
  }

  public getParentPage(): IWorkspacePage {
    return this.workspacePage;
  }

  public serialize(): ISerializedLayer {
    const { id, hidden, locked, selected, name, _mask: mask } = this;

    const serialized = {
      id,
      hidden,
      locked,
      selected,
      name,
      mask,
    };

    /**
     * Make instance property as non configurable.
     * For prevent vue-reactive adding getters an setters on heavy objects
     */
    Object.defineProperty(serialized, 'instance', { configurable: false, value: this._proxy });

    return serialized as ISerializedLayer;
  }

  protected $didUpdate: { type: UpdateTick; child: CommonLayer | null } = {
    type: UpdateTick.None,
    child: null,
  };
}
