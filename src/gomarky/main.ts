import 'normalize.css/normalize.css';
import './../../static/styles/main.css';
import { Disposable } from '@/base/common/lifecycle';

import { ServiceCollection } from '@/platform/instantiation/common/ServiceCollection';
import { ILogService } from '@/platform/log/common/log';
import { Workbench } from '@/code/electron-browser/workbench/workbench';

import {
  CommandImpl,
  CommandsRegistry,
  ICommandService,
} from '@/platform/commands/electron-browser/commands';

import { domContentLoaded } from '@/base/electron-browser/dom';
import { IKeyboardService } from '@/platform/keyboard/electron-browser/keyboard';

import { IFileService } from '@/platform/files/common/files';
import { DiskFileSystemProvider } from '@/platform/files/node/diskFileSystemProvider';
import { Schemas } from '@/base/common/network';

import { IWindowConfiguration } from '@/platform/windows/common/windows';
import * as perf from '@/base/common/perfomance';
import { IInstantiationService } from '@/platform/instantiation/common/instantiation';
import { getSingletonServiceDescriptors } from '@/platform/instantiation/common/singleton';

declare global {
  interface Window {
    Gomarky_WIN_CONFIGURATION: Required<IWindowConfiguration>;
  }
}

export class CodeRenderer extends Disposable {
  private workbench: Workbench;

  public async open(serviceCollection: ServiceCollection): Promise<ServiceCollection> {
    const services = await this.initServices(serviceCollection);

    await domContentLoaded();

    perf.mark(`willStartWorkbench`);

    this.workbench = new Workbench(document.body, services, services.get(ILogService));

    this.workbench.startup();

    const commandService = services.get(ICommandService);
    const keyboardService = services.get(IKeyboardService);

    CommandsRegistry.registerCommand(
      'gomarky.command.redo',
      () => new CommandImpl(() => commandService.redoCommand())
    );
    CommandsRegistry.registerCommand(
      'gomarky.command.undo',
      () => new CommandImpl(() => commandService.undoCommand())
    );

    await keyboardService.registerShortcut({
      id: 'gomarky.command.undo',
      accelerator: 'CmdOrCtrl+Z',
      autoRepeat: true,
    });

    await keyboardService.registerShortcut({
      id: 'gomarky.command.redo',
      accelerator: 'CmdOrCtrl+Shift+Z',
      autoRepeat: true,
    });

    return services;
  }

  private async initServices(services: ServiceCollection): Promise<ServiceCollection> {
    const fileService = services.get(IFileService);
    const logService = services.get(ILogService);

    const diskFileSystemProvider = new DiskFileSystemProvider(logService);

    fileService.registerProvider(Schemas.file, diskFileSystemProvider);

    return services;
  }
}

export function createRenderer(): Promise<ServiceCollection> {
  const renderer = new CodeRenderer();
  const services = require('./descriptors').default;

  const instantiationService = services.get(IInstantiationService);

  // make sure to add all services that use `registerSingleton`
  for (const [id, descriptor] of getSingletonServiceDescriptors()) {
    instantiationService.createInstance2(descriptor, id);
  }

  return renderer.open(services);
}
