import {
  createDecorator,
  IInstantiationService,
} from '@/platform/instantiation/common/instantiation';
import { Disposable } from '@/base/common/lifecycle';

import { CreateContext, IWindowsMainService } from '@/platform/windows/electron-main/windows';
import { IStateService } from '@/platform/state/common/state';

import { defaultWindowState, ICodeWindow } from '@/platform/window/electron-main/window';
import { IWorkspaceIdentifier } from '@/platform/workspaces/common/workspaces';
import product from '@/platform/product/node';
import { basename } from '@/base/common/uri';
import { isDev } from '@/base/platform';

export interface IPreferencesService {
  openSettingsWindow(workspace: IWorkspaceIdentifier): ICodeWindow;
}

export const IPreferencesService = createDecorator<IPreferencesService>('preferencesService');

export class PreferencesService extends Disposable implements IPreferencesService {
  constructor(
    @IInstantiationService private readonly instantiationService: IInstantiationService,
    @IWindowsMainService private readonly windowsMainService: IWindowsMainService,
    @IStateService private readonly stateService: IStateService
  ) {
    super();
  }

  public openSettingsWindow(workspace: IWorkspaceIdentifier): ICodeWindow {
    const window = this.windowsMainService.openNewWindow(CreateContext.DESKTOP, {
      state: defaultWindowState(),
      forcedUrl: 'settings.html',
      workspace,
    });

    window.win.setTitle(`${product.nameLong} - Preferences - ${basename(workspace.configPath)}`);

    if (isDev) {
      window.win.webContents.openDevTools({ mode: 'right' });
    }

    return window;
  }
}
