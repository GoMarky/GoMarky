import { Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { IContextKeyService } from '@/platform/contextkey/common/contextkey';
import services from '@/gomarky/descriptors';

import { TAG_TYPES } from '@/platform/store/electron-browser/toolbar/common';
import { ToolbarContextKeys } from '@/gomarky/scene/common/sceneContextKeys';

import store from '@/platform/store/electron-browser';
import { AttributeType } from '@/platform/attributes/electron-browser/attributes';

export interface IToolbarState {
  hasShowTooltip: boolean;
  hasOpenDatasetList: boolean;

  hasShowClassBlock: boolean;
  hasShowFigureBlock: boolean;

  hasShowObjectBlock: boolean;
  hasShowPictureBlock: boolean;
  hasActiveMaskPanel: boolean;

  tagTypings: AttributeType[];

  currentPaginationImagePage: number;
  searchPaginationImageValue: string;

  mSetTooltipView(view: boolean): void;
  mSetClassesView(view: boolean): void;
  mSetFigureView(view: boolean): void;

  mSetObjectView(view: boolean): void;
  mSetPictureView(view: boolean): void;
  mSetPaginationImagePage(pageNumber: number): void;

  mSetDatasetListView(view: boolean): void;
  mSetMaskPanelState(show: boolean): void;
}

const contextKeyService = services.get(IContextKeyService);

const hasShowTooltipContext = ToolbarContextKeys.hasShowToolTip.bindTo(contextKeyService);
const hasOpenDatasetListContext = ToolbarContextKeys.hasOpenDatasetList.bindTo(contextKeyService);

@Module({ namespaced: true, dynamic: true, store, name: 'toolbar' })
export class ToolbarModule extends VuexModule implements IToolbarState {
  public hasShowTooltip = hasShowTooltipContext.get() as boolean;
  public hasOpenDatasetList = hasOpenDatasetListContext.get() as boolean;

  public hasShowClassBlock = true;
  public hasShowFigureBlock = true;

  public hasActiveMaskPanel = false;

  public readonly tagTypings: AttributeType[] = TAG_TYPES;

  public hasShowObjectBlock = true;
  public hasShowPictureBlock = true;
  public hasShowPaginationImageSearchBlock = false;

  public currentPaginationImagePage = 1;
  public searchPaginationImageValue = '';

  @Mutation
  public mSetMaskPanelState(show: boolean): void {
    this.hasActiveMaskPanel = show;
  }

  @Mutation
  public mSetTooltipView(view: boolean): void {
    this.hasShowTooltip = view;
    hasShowTooltipContext.set(view);
  }

  @Mutation
  public mSetDatasetListView(view: boolean): void {
    this.hasOpenDatasetList = view;
    hasOpenDatasetListContext.set(view);
  }

  @Mutation
  public mSetClassesView(view: boolean): void {
    this.hasShowClassBlock = view;
  }

  @Mutation
  public mSetFigureView(view: boolean): void {
    this.hasShowFigureBlock = view;
  }

  @Mutation
  public mSetObjectView(view: boolean): void {
    this.hasShowObjectBlock = view;
  }

  @Mutation
  public mSetPictureView(view: boolean): void {
    this.hasShowPictureBlock = view;
  }

  @Mutation
  public mSetPaginationImagePage(pageNumber: number): void {
    this.currentPaginationImagePage = pageNumber;
  }
}
