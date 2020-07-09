import store from './../index';
import { Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { LabelServiceCurrentProperty } from '@/code/common/label/label';
import { ToolServiceCurrentProperty } from '@/code/common/tool/tool';

import { TextureServiceCurrentProperty } from '@/code/common/texture/texture';
import { MaskServiceCurrentProperty } from '@/code/common/tool/mask';

export interface ISceneState {
  currentLabel: LabelServiceCurrentProperty;
  currentTool: ToolServiceCurrentProperty;
  currentMask: MaskServiceCurrentProperty;

  currentTexture: TextureServiceCurrentProperty;

  pendingWriteAnnotationFile: boolean;

  mSetCurrentLabel(label: LabelServiceCurrentProperty): void;
  mSetCurrentTool(tool: ToolServiceCurrentProperty): void;
  mSetCurrentTexture(texture: TextureServiceCurrentProperty): void;
  mSetCurrentMask(mask: MaskServiceCurrentProperty): void;

  mSetPendingWriteAnnotationFile(isPendingWriteFile: boolean): void;
}

@Module({ namespaced: true, dynamic: true, store, name: 'scene' })
export class SceneModule extends VuexModule implements ISceneState {
  public currentLabel: LabelServiceCurrentProperty = null;
  public currentTool: ToolServiceCurrentProperty = null;

  public currentTexture: TextureServiceCurrentProperty = null;
  public currentMask: MaskServiceCurrentProperty = null;

  public pendingWriteAnnotationFile = false;

  @Mutation
  public mSetPendingWriteAnnotationFile(isPendingWriteFile: boolean): void {
    this.pendingWriteAnnotationFile = isPendingWriteFile;
  }

  @Mutation
  public mSetCurrentLabel(label: LabelServiceCurrentProperty): void {
    this.currentLabel = label;
  }

  @Mutation
  public mSetCurrentTool(tool: ToolServiceCurrentProperty): void {
    this.currentTool = tool;
  }

  @Mutation
  public mSetCurrentMask(mask: MaskServiceCurrentProperty): void {
    this.currentMask = mask;
  }

  @Mutation
  mSetCurrentTexture(texture: TextureServiceCurrentProperty): void {
    this.currentTexture = texture;
  }
}
