import { ServiceCollection } from '@/platform/instantiation/common/ServiceCollection';
import { ILifecycleService } from '@/platform/lifecycle/common/lifecycle';
import { INotificationService } from '@/platform/notification/common/notification';

import { IFileService } from '@/platform/files/common/files';
import { IInstantiationService } from '@/platform/instantiation/common/instantiation';
import { ITelemetryService } from '@/platform/telemetry/common/telemetry';

import { IEnvironmentService } from '@/platform/env/common/environment';
import { IStoreService, StoreService } from '@/platform/store/common/storeService';
import { ILogService } from '@/platform/log/common/log';

import { IContextKeyService } from '@/platform/contextkey/common/contextkey';
import { RouterService } from '@/platform/router/electron-browser/router';

import { IRouterService } from '@/platform/router/common/router';
import { IWorkspacesService } from '@/platform/workspaces/common/workspaces';
import { WorkspaceService } from '@/code/electron-browser/configuration/configurationService';

import { IWorkspaceContextService } from '@/platform/workspace/common/workspace';

import {
  IStaticExtensionsService,
  StaticExtensionsService,
} from '@/platform/extensions/electron-browser/staticExtensionService';

import { ExtensionService } from '@/platform/extensions/electron-browser/extensionService';
import { IExtensionService } from '@/platform/extensions/common/extension';

import { PreferencesService } from '@/platform/preferences/electron-browser/preferences';
import { IPreferencesService } from '@/platform/preferences/common/preferences';
import { NotificationService } from '@/platform/notification/electron-browser/notification';

import { IMainProcessService } from '@/platform/ipc/electron-browser/mainProcessService';

export function createWorkspaceServices(services: ServiceCollection): ServiceCollection {
  const lifecycleService = services.get(ILifecycleService);
  const fileService = services.get(IFileService);
  const workspacesService = services.get(IWorkspacesService);

  const instantiationService = services.get(IInstantiationService);
  const telemetryService = services.get(ITelemetryService);
  const environmentService = services.get(IEnvironmentService);

  const logService = services.get(ILogService);

  // vuex store service
  const storeService = new StoreService(logService);
  services.set(IStoreService, storeService);

  // router service
  const routerService = new RouterService(lifecycleService);
  services.set(IRouterService, routerService);

  // notification service
  const notificationService = new NotificationService(lifecycleService, storeService);
  services.set(INotificationService, notificationService);

  // workspace service
  const workspace = new WorkspaceService(
    instantiationService,
    environmentService,
    storeService,
    lifecycleService,
    workspacesService,
    fileService
  );
  services.set(IWorkspaceContextService, workspace);

  // static extensions service
  const staticExtensionService = new StaticExtensionsService(lifecycleService, fileService);
  services.set(IStaticExtensionsService, staticExtensionService);

  // extensions service
  const extensionService = new ExtensionService(
    instantiationService,
    lifecycleService,
    notificationService,
    telemetryService,
    fileService,
    staticExtensionService,
    environmentService
  );
  services.set(IExtensionService, extensionService);

  const preferencesService = new PreferencesService();
  services.set(IPreferencesService, preferencesService);

  return services;
}
