import { IServicesAccessor } from '@/platform/instantiation/common/instantiation';
import { IWindowService, IWindowsService } from '@/platform/windows/common/windows';
import * as gomarky from 'gomarky';

import {  ICommandService } from '@/platform/commands/electron-browser/commands';
import { Disposable } from '@/base/common/lifecycle';

export interface IExtensionApiFactory {
  (): typeof gomarky;
}

export function createApiFactoryAndRegisterActors(
  accessor: IServicesAccessor
): IExtensionApiFactory {
  const windowsService = accessor.get(IWindowsService);
  const commandService = accessor.get(ICommandService);
  const windowService = accessor.get(IWindowService);

  return function(): typeof gomarky {
    const window: typeof gomarky.window = {
      get state() {
        return {
          focused: false,
        };
      },

      get onDidWindowFocus() {
        return windowsService.onWindowFocus;
      },

      async toggleFullScreen() {
        return windowService.toggleFullScreen();
      },
      async maximize() {
        return windowService.maximize();
      },
    };

    const commands: typeof gomarky.commands = {
      executeCommand<T>(command: string, ...args: any[]): Promise<T | void> {
        return commandService.executeCommand(command, args);
      },
    };

    return ({
      window,
      commands,
      Disposable: Disposable,
    } as unknown) as typeof gomarky;
  };
}
