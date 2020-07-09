import product from '@/platform/product/node';
import { app, shell, WebContents } from 'electron';
import {
  ILifecycleService,
  LifecycleMainPhase,
} from '@/platform/lifecycle/electron-main/lifecycle';

import { ILogService } from '@/platform/log/common/log';
import { ServiceCollection } from '@/platform/instantiation/common/ServiceCollection';
import {
  CreateContext,
  IWindowsMainService,
  WindowsMainService,
} from '@/platform/windows/electron-main/windows';

import {
  IWorkspacesMainService,
  WorkspacesMainService,
} from '@/platform/workspaces/electron-main/workspacesMainService';
import { IStateService } from '@/platform/state/common/state';
import { IStorageService } from '@/platform/storage/common/storage';

import { WindowsService } from '@/platform/windows/electron-main/windowsService';
import { MenubarService } from '@/platform/menubar/electron-main/menubarService';
import { IMenubarService } from '@/platform/menubar/common/menubar';

import { IWindowsService } from '@/platform/windows/common/windows';
import { MenubarChannel } from '@/platform/menubar/node/menubar';
import { IPCServer } from '@/platform/ipc/electron-main/ipcServer';

import { WindowsChannel } from '@/platform/windows/node/windows';
import { WorkspacesChannel } from '@/platform/workspaces/node/workspaces';
import { isWindows } from '@/base/platform';

import { CommandService, ICommandMainService } from '@/platform/commands/electron-main/commands';
import { HistoryMainService } from '@/platform/history/electron-main/history';
import { IHistoryMainService } from '@/platform/history/common/history';
import { StateServiceChannel } from '@/platform/state/node/state';

import { IWindowState, WindowMode } from '@/platform/window/electron-main/window';
import { WorkspacesService } from '@/platform/workspaces/electron-main/workspacesService';
import { IWorkspacesService } from '@/platform/workspaces/common/workspaces';

import { IInstantiationService } from '@/platform/instantiation/common/instantiation';
import { KeyboardChannel } from '@/platform/keyboard/node/keyboard';
import { KeyboardRegistry } from '@/platform/keyboard/electron-main/keyboard';

import {
  IPreferencesService,
  PreferencesService,
} from '@/platform/preferences/electron-main/preferences';

import { FileService } from '@/platform/files/common/fileService';
import { IFileService } from '@/platform/files/common/files';
import { SessionMainService } from '@/platform/session/electron-main/sessionMainService';

import { ISessionMainService } from '@/platform/session/electron-main/session';
import { IRequestService } from '@/platform/request/common/requestService';

import { SessionService } from '@/platform/session/electron-main/sessionService';
import { ISessionService, SessionError } from '@/platform/session/common/session';
import { SessionChannel } from '@/platform/session/node/session';

import { IEnvironmentService } from '@/platform/env/node/environmentService';
import requests from '@/platform/request/electron-main/request/requests';

export class CodeApplication {
  private windowsMainService: IWindowsMainService;

  constructor(
    @IInstantiationService private readonly instantiationService: IInstantiationService,
    @ILifecycleService private readonly lifecycleService: ILifecycleService,
    @ILogService private readonly logService: ILogService,
    @IStateService private readonly stateService: IStateService
  ) {
    this.registerListeners();
  }

  public startup(services: ServiceCollection): void {
    if (isWindows && product) {
      app.setAppUserModelId(product.win32AppUserModelId);
    }

    this.initServices(services).then(() => this.openFirstWindow(services));
  }

  private async openFirstWindow(services: ServiceCollection): Promise<void> {
    const ipcServer = new IPCServer(this.windowsMainService);

    const menubarService = services.get(IMenubarService);
    const menubarChannel = new MenubarChannel(menubarService);
    ipcServer.registerChannel('menubar', menubarChannel);

    const windowsService = services.get(IWindowsService);
    const windowsChannel = new WindowsChannel(windowsService);
    ipcServer.registerChannel('windows', windowsChannel);

    const workspacesService = services.get(IWorkspacesService);
    const workspacesChannel = new WorkspacesChannel(workspacesService);
    ipcServer.registerChannel('workspaces', workspacesChannel);

    const stateService = services.get(IStateService);
    const stateServiceChannel = new StateServiceChannel(stateService);
    ipcServer.registerChannel('state', stateServiceChannel);

    const sessionService = services.get(ISessionService);
    const sessionChannel = new SessionChannel(sessionService);
    ipcServer.registerChannel('session', sessionChannel);

    const keyboardChannel = new KeyboardChannel(this.instantiationService, KeyboardRegistry);
    ipcServer.registerChannel('keyboard', keyboardChannel);

    this.lifecycleService.phase = LifecycleMainPhase.Ready;

    try {
      // Session time is not coming yet.
      // await sessionMainService.restoreSession();

      return this.doOpenFirstWindow();
    } catch (error) {
      // if we cant restore session we should send user to license window

      if (error instanceof SessionError) {
        this.logService.error(`CodeApplication#openFirstWindow`, `Session was not found`);

        return this.openLicenseWindow();
      }

      return this._onUnexpectedError(error);
    }
  }

  private async doOpenFirstWindow(): Promise<void> {
    // if user has not active license we should show window with it.

    const openedWindows = await this.windowsMainService.open({
      context: CreateContext.API,
      initialStartup: true,
    });

    if (!openedWindows.length) {
      await this.windowsMainService.openWelcomeWindow();
    }

    this.lifecycleService.phase = LifecycleMainPhase.AfterWindowOpen;
  }

  private async openLicenseWindow(): Promise<void> {
    const windowState: IWindowState = {};

    windowState.mode = WindowMode.Normal;

    this.windowsMainService.openNewWindow(CreateContext.API, {
      state: windowState,
      forcedUrl: 'license.html',
    });
  }

  private async initServices(services: ServiceCollection) {
    const lifecycleService = services.get(ILifecycleService);
    const logService = services.get(ILogService);
    const stateService = services.get(IStateService);

    const storageService = services.get(IStorageService);
    const instantiationService = services.get(IInstantiationService);
    const environmentService = services.get(IEnvironmentService);
    const requestService = services.get(IRequestService);

    requestService.registerRequests(requests);

    const fileService = new FileService(logService);
    services.set(IFileService, fileService);

    const sessionMainService = new SessionMainService(
      requestService,
      fileService,
      stateService,
      environmentService
    );
    services.set(ISessionMainService, sessionMainService);

    const historyMainService = new HistoryMainService(stateService);
    services.set(IHistoryMainService, historyMainService);

    const workspaceMainService = new WorkspacesMainService(
      logService,
      lifecycleService,
      historyMainService,
      storageService,
      stateService
    );
    services.set(IWorkspacesMainService, workspaceMainService);

    const workspaceService = new WorkspacesService(
      workspaceMainService,
      logService,
      lifecycleService,
      stateService,
      historyMainService
    );
    services.set(IWorkspacesService, workspaceService);

    const windowsMainService = (this.windowsMainService = new WindowsMainService(
      logService,
      lifecycleService,
      stateService,
      workspaceMainService,
      sessionMainService
    ));
    services.set(IWindowsMainService, windowsMainService);

    const preferencesService = new PreferencesService(
      instantiationService,
      windowsMainService,
      stateService
    );
    services.set(IPreferencesService, preferencesService);

    const commandMainService = new CommandService(windowsMainService);
    services.set(ICommandMainService, commandMainService);

    const windowsService = new WindowsService(
      windowsMainService,
      historyMainService,
      lifecycleService,
      logService,
      environmentService
    );
    services.set(IWindowsService, windowsService);

    const sessionService = new SessionService(sessionMainService);
    services.set(ISessionService, sessionService);

    const menubarService = new MenubarService(
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
    services.set(IMenubarService, menubarService);
  }

  private _onUnexpectedError(err: Error): void {
    this.logService.error(`[uncaught exception in main]: ${err}`);

    if (err.stack) {
      this.logService.error(err.stack);
    }
  }

  private registerListeners(): void {
    this.lifecycleService.onWillOpenWelcomeWindow(() => {
      return this.windowsMainService.openWelcomeWindow();
    });

    process.on('uncaughtException', err => this._onUnexpectedError(err));

    process.on('unhandledRejection', (reason: unknown) => this._onUnexpectedError(reason as Error));

    app.on('web-contents-created', (_: unknown, contents: WebContents) => {
      contents.on('new-window', async (event: Event, url: string) => {
        event.preventDefault();

        try {
          await shell.openExternal(url);
        } catch (err) {
          // catching error when open link
        }
      });
    });
  }
}
