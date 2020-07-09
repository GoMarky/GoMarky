import { ServiceCollection } from '@/platform/instantiation/common/ServiceCollection';
import { ILogService } from '@/platform/log/common/log';
import { onUnexpectedError } from '@/base/common/errors';

import {
  IInstantiationService,
  IServicesAccessor,
} from '@/platform/instantiation/common/instantiation';
import { Registry } from '@/platform/registry/common/registry';
import { IWorkbenchContributionsRegistry } from '@/workbench/common/contributions';
import * as perf from '@/base/common/perfomance';

import { Extensions as WorkbenchExtensions } from '@/workbench/common/contributions';

import '@/workbench/workbench.desktop.main';

export class Workbench {
  constructor(
    private readonly parent: HTMLElement,
    private readonly serviceCollection: ServiceCollection,
    @ILogService private readonly logService: ILogService
  ) {
    this.registerErrorHandler();
  }

  public startup(): void {
    perf.mark(`WorkbenchStartup`);

    try {
      const instantiationService = this.serviceCollection.get(IInstantiationService);

      instantiationService.invokeFunction(accessor => {
        this.startRegistries(accessor);

        this.registerListeners();
      });
    } catch (error) {
      onUnexpectedError(error);

      throw error;
    }
  }

  private startRegistries(accessor: IServicesAccessor): void {
    Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).start(accessor);
  }

  private registerErrorHandler(): void {
    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
      onUnexpectedError(event.reason);
      // do not showing message to console
      event.preventDefault();
    });
  }

  private registerListeners(): void {
    //
  }
}
