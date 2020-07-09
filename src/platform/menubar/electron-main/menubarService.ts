import { ILogService } from '@/platform/log/common/log';
import { Menubar } from '@/platform/menubar/electron-main/menubar';
import { IMenubarData, IMenubarService } from '@/platform/menubar/common/menubar';

import { IWindowsService } from '@/platform/windows/common/windows';
import { IWorkspacesMainService } from '@/platform/workspaces/electron-main/workspacesMainService';
import { ICommandMainService } from '@/platform/commands/electron-main/commands';

import { IWindowsMainService } from '@/platform/windows/electron-main/windows';
import { IStateService } from '@/platform/state/common/state';
import { IHistoryMainService } from '@/platform/history/common/history';

import { IPreferencesService } from '@/platform/preferences/electron-main/preferences';
import { ISessionService } from '@/platform/session/common/session';

export class MenubarService implements IMenubarService {
  private readonly _menubar: Menubar;

  constructor(
    @ILogService private readonly logService: ILogService,
    @IPreferencesService private readonly preferencesService: IPreferencesService,
    @IHistoryMainService private readonly historyMainService: IHistoryMainService,
    @IWindowsService private readonly windowsService: IWindowsService,
    @IStateService private readonly stateService: IStateService,
    @IWorkspacesMainService private readonly workspaceMainService: IWorkspacesMainService,
    @IWindowsMainService private readonly windowsMainService: IWindowsMainService,
    @ICommandMainService private readonly commandMainService: ICommandMainService,
    @ISessionService private readonly sessionService: ISessionService
  ) {
    // Install Menubar
    this._menubar = new Menubar(
      logService,
      preferencesService,
      historyMainService,
      windowsService,
      stateService,
      workspaceMainService,
      windowsMainService,
      commandMainService,
      sessionService
    );

    this.registerListeners();
  }

  public updateMenubar(windowId: number, _menus?: IMenubarData): Promise<void> {
    this.logService.trace('menubarService#updateMenubar', `WindowId ${windowId}`);

    if (this._menubar) {
      this._menubar.updateMenu();
    }

    return Promise.resolve(undefined);
  }

  private registerListeners() {
    this.historyMainService.onRecentlyOpenedChange(() => {
      const lastActiveWindow = this.windowsMainService.getLastActiveWindow();

      if (lastActiveWindow) {
        this.updateMenubar(lastActiveWindow.id);
      }
    });
  }
}
