import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import store from '../index';
import services from '@/gomarky/descriptors';
import { IStateService, IStateServiceStorageSchema } from '@/platform/state/common/state';

const stateService = services.get(IStateService);

export interface IGlobalState {
  workspaces: string[];

  getItem<T>(key: keyof IStateServiceStorageSchema, defaultValue: T): Promise<void>;

  getItem<T>(key: keyof IStateServiceStorageSchema, defaultValue?: T): Promise<void>;
}

@Module({ namespaced: true, dynamic: true, store, name: 'global' })
export class StateModule extends VuexModule implements IGlobalState {
  public workspaces: string[] = [];

  @Mutation
  public mSetWorkspaces(workspaces: string[]) {
    this.workspaces = workspaces;
  }

  @Action({ rawError: true })
  public async getItem<T>(key: keyof IStateServiceStorageSchema, defaultValue: T): Promise<void> {
    const workspaces = await stateService.getItem<T>(key, defaultValue);

    this.mSetWorkspaces((workspaces as unknown) as string[]);
  }
}
