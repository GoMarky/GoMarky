import { Disposable } from '@/base/common/lifecycle';
import { IExtensionService, IWillActivateEvent } from '@/platform/extensions/common/extension';
import { Emitter } from '@/base/common/event';

import { Event } from '@/base/common/event';
import { Barrier } from '@/base/common/async';
import { IInstantiationService } from '@/platform/instantiation/common/instantiation';

import { INotificationService } from '@/platform/notification/common/notification';
import { ITelemetryService } from '@/platform/telemetry/common/telemetry';
import { IFileService } from '@/platform/files/common/files';

import * as perf from '@/base/common/perfomance';
import { ILifecycleService } from '@/platform/lifecycle/common/lifecycle';
import { ExtensionDescriptionRegistry } from '@/platform/extensions/electron-browser/extensionDescriptionRegistry';

export abstract class AbstractExtensionService extends Disposable implements IExtensionService {
  public serviceBrand = IExtensionService;

  protected readonly _onDidRegisterExtensions: Emitter<void> = this._register(new Emitter<void>());
  public readonly onDidRegisterExtensions = this._onDidRegisterExtensions.event;

  protected readonly _onWillActivateByEvent = this._register(new Emitter<IWillActivateEvent>());
  public readonly onWillActivateByEvent: Event<IWillActivateEvent> = this._onWillActivateByEvent
    .event;

  private readonly _installedExtensionsReady: Barrier = new Barrier();

  protected _registry: ExtensionDescriptionRegistry;

  protected constructor(
    @IInstantiationService protected readonly instantiationService: IInstantiationService,
    @ILifecycleService protected readonly lifecycleService: ILifecycleService,
    @INotificationService protected readonly notificationService: INotificationService,
    @ITelemetryService protected readonly telemetryService: ITelemetryService,
    @IFileService protected readonly fileService: IFileService
  ) {
    super();

    this._registry = this.instantiationService.createInstance(ExtensionDescriptionRegistry, []);
  }

  protected async initialize(): Promise<void> {
    perf.mark('Start loading extensions');

    this.whenInstalledExtensionsRegistered().then(() => perf.mark(`Extensions are loaded.`));
    await this.scanAndHandleExtensions();
    this.releaseBarrier();
  }

  public whenInstalledExtensionsRegistered(): Promise<boolean> {
    return this._installedExtensionsReady.wait();
  }

  private releaseBarrier(): void {
    perf.mark('extensionHostReady');

    this._installedExtensionsReady.open();
    this._onDidRegisterExtensions.fire();
  }

  protected abstract scanAndHandleExtensions(): Promise<void>;
}
