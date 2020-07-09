import { Vue } from 'vue-property-decorator';
import Vuex, { Store } from 'vuex';
import { IWorkspaceState } from '@/platform/store/electron-browser/workspace';
import { INotificationState } from '@/platform/store/electron-browser/notification';

import { IGlobalState } from '@/platform/store/electron-browser/state';
import { ISceneState } from '@/platform/store/electron-browser/scene';
import { IModalState } from '@/platform/store/electron-browser/modal';
import { IInstantiationService } from '@/platform/instantiation/common/instantiation';

import { IToolbarState } from '@/platform/store/electron-browser/toolbar';
import { ILayerState } from '@/platform/store/electron-browser/layer';

Vue.use(Vuex);

export interface IRootState {
  workspace: IWorkspaceState;
  notification: INotificationState;
  global: IGlobalState;
  scene: ISceneState;
  toolbar: IToolbarState;
  modal: IModalState;
  layer: ILayerState;
}

export interface IExpandedStore extends Store<IRootState> {
  instantiationService: IInstantiationService;
}

const store = new Vuex.Store<IRootState>({ strict: process.env.NODE_ENV !== 'production' });

export default (store as unknown) as IExpandedStore;
