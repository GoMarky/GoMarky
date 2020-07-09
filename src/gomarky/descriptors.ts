import { IMenubarService } from '@/platform/menubar/common/menubar';
import { MenubarService } from '@/platform/menubar/electron-browser/menubar';
import {
  IMainProcessService,
  MainProcessService,
} from '@/platform/ipc/electron-browser/mainProcessService';

import { ConsoleLogService } from '@/platform/log/electron-browser/consoleLogRenderer';
import { LogLevel } from '@/platform/log/common/abstractLog';
import { ILogService } from '@/platform/log/common/log';

import {
  IWindowConfiguration,
  IWindowService,
  IWindowsService,
} from '@/platform/windows/common/windows';

import { EnvironmentService, IEnvironmentService } from '@/platform/env/common/environment';
import { CodeWindowRenderer } from '@/platform/window/electron-browser/window';
import { CommandService, ICommandService } from '@/platform/commands/electron-browser/commands';

import { StateService } from '@/platform/state/electron-browser/state';
import { IStateService } from '@/platform/state/common/state';
import { ILifecycleService } from '@/platform/lifecycle/common/lifecycle';
import { LifecycleService } from '@/platform/lifecycle/electron-browser/lifecycle';
import { IKeyboardService, KeyboardService } from '@/platform/keyboard/electron-browser/keyboard';

import { InstantiationService } from '@/platform/instantiation/common/instantiation';
import { ContextKeyService } from '@/platform/contextkey/common/contextKeyService';
import { IContextKeyService } from '@/platform/contextkey/common/contextkey';

import { FileService } from '@/platform/files/common/fileService';

import { IFileService } from '@/platform/files/common/files';
import { ServiceCollection } from '@/platform/instantiation/common/ServiceCollection';
import { WindowsService } from '@/platform/windows/electron-browser/windowsService';
import { TelemetryService } from '@/platform/telemetry/electron-browser/telemetry';

import { ITelemetryService } from '@/platform/telemetry/common/telemetry';
import { SessionService } from '@/platform/session/electron-browser/sessionService';
import { ISessionService } from '@/platform/session/common/session';

import store from '@/platform/store/electron-browser';
import { WorkspacesService } from '@/platform/workspaces/electron-browser/workspacesService';
import { IWorkspacesService } from '@/platform/workspaces/common/workspaces';

const windowConfiguration: Required<IWindowConfiguration> = window.Gomarky_WIN_CONFIGURATION;

const services = new ServiceCollection();

// instantiation service
const instantiationService = new InstantiationService(services, true);
store.instantiationService = instantiationService;

// log renderer process
const logService = new ConsoleLogService(LogLevel.Info);
services.set(ILogService, logService);

// context key service
const contextKeyService = new ContextKeyService();
services.set(IContextKeyService, contextKeyService);

// environment (window configuration, cli args)
const environmentService = new EnvironmentService(windowConfiguration);
services.set(IEnvironmentService, environmentService);

// IPC connection to main process
const mainProcessService = new MainProcessService();
services.set(IMainProcessService, mainProcessService);

// workspaces service
const workspacesService = new WorkspacesService(mainProcessService);
services.set(IWorkspacesService, workspacesService);

// keyboard service
const keyboardService = new KeyboardService(mainProcessService);
services.set(IKeyboardService, keyboardService);

// file service
const fileService = new FileService(logService);
services.set(IFileService, fileService);

// state ipc implementation
const stateService = new StateService(mainProcessService);
services.set(IStateService, stateService);

// telemetry service
const telemetryService = new TelemetryService();
services.set(ITelemetryService, telemetryService);

// session service
const sessionService = new SessionService(mainProcessService);
services.set(ISessionService, sessionService);

// windows ipc implementation
const windowsService = new WindowsService(mainProcessService);
services.set(IWindowsService, windowsService);

// window ipc implementation
const windowService = new CodeWindowRenderer(environmentService, windowsService, contextKeyService);
services.set(IWindowService, windowService);

// lifecycle service
const lifecycleService = new LifecycleService(windowService, stateService, logService);
services.set(ILifecycleService, lifecycleService);

// menubar ipc implementation
const menubarService = new MenubarService(mainProcessService);
services.set(IMenubarService, menubarService);

// command service
const commandService = new CommandService(instantiationService, lifecycleService, logService);
services.set(ICommandService, commandService);

export default services;
