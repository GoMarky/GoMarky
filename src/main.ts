/*---------------------------------------------------------------------------------------------
 * main.ts
 * Входная точка приложения, первый модуль, которая начинается исполняться при запуске.
 * Запускает работу всей программы.
 *--------------------------------------------------------------------------------------------*/

import { CodeApplication } from '@/code/electron-main/app';
import { ServiceCollection } from '@/platform/instantiation/common/ServiceCollection';
import { ILifecycleService, LifecycleService } from '@/platform/lifecycle/electron-main/lifecycle';

import { ConsoleLogMainService } from '@/platform/log/electron-main/consoleLogMain';
import { StateService } from '@/platform/state/electron-main/stateService';
import { LogLevel } from '@/platform/log/common/abstractLog';

import { ILogService } from '@/platform/log/common/log';
import { IStateService } from '@/platform/state/common/state';
import { StorageService } from '@/platform/storage/electron-main/storage';

import { IStorageService } from '@/platform/storage/common/storage';
import { EnvironmentService, IEnvironmentService } from '@/platform/env/node/environmentService';

import {
  IInstantiationService,
  InstantiationService,
} from '@/platform/instantiation/common/instantiation';

import { RequestService } from '@/platform/request/electron-main/requestService';
import { IRequestService } from '@/platform/request/common/requestService';

async function createServices(): Promise<ServiceCollection> {
  const services = new ServiceCollection();

  const consoleLogService = new ConsoleLogMainService(LogLevel.Info);
  services.set(ILogService, consoleLogService);
  consoleLogService.setLevel(LogLevel.Trace);

  const instantiationService = new InstantiationService(services, true);

  const requestService = new RequestService(consoleLogService, instantiationService);
  services.set(IRequestService, requestService);

  const environmentService = new EnvironmentService();
  services.set(IEnvironmentService, environmentService);

  const lifecycleService = new LifecycleService(consoleLogService);
  services.set(ILifecycleService, lifecycleService);

  const stateService = new StateService(environmentService);
  services.set(IStateService, stateService);

  const storageService = new StorageService(consoleLogService);
  services.set(IStorageService, storageService);

  return services;
}

function startup(): void {
  createServices().then((services: ServiceCollection) => {
    const logService = services.get(ILogService);
    const lifecycleService = services.get(ILifecycleService);
    const stateService = services.get(IStateService);

    const instantiationService = services.get(IInstantiationService);

    const application = new CodeApplication(
      instantiationService,
      lifecycleService,
      logService,
      stateService
    );

    application.startup(services);
  });
}

function main(): void {
  startup();
}

main();
