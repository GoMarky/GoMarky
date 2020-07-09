import { IExtensionService } from '@/platform/extensions/common/extension';
import { AbstractExtensionService } from '@/platform/extensions/electron-browser/abstractExtensionService';
import { IInstantiationService } from '@/platform/instantiation/common/instantiation';

import { INotificationService } from '@/platform/notification/common/notification';
import { ITelemetryService } from '@/platform/telemetry/common/telemetry';
import { IFileService } from '@/platform/files/common/files';

import { DisposableStore } from '@/base/common/lifecycle';
import { IStaticExtensionsService } from '@/platform/extensions/electron-browser/staticExtensionService';
import { ExtHostExtensionService } from '@/platform/extensions/electron-browser/extHostExtensionService';

import { ILifecycleService, LifePhase } from '@/platform/lifecycle/common/lifecycle';
import { timeout } from '@/base/common/async';
import { IEnvironmentService } from '@/platform/env/common/environment';

export class ExtensionService extends AbstractExtensionService implements IExtensionService {
  private _disposables = new DisposableStore();
  private _extHostExtensionService: ExtHostExtensionService;

  constructor(
    @IInstantiationService instantiationService: IInstantiationService,
    @ILifecycleService lifecycleService: ILifecycleService,
    @INotificationService notificationService: INotificationService,
    @ITelemetryService telemetryService: ITelemetryService,
    @IFileService fileService: IFileService,
    @IStaticExtensionsService private readonly staticExtensionService: IStaticExtensionsService,
    @IEnvironmentService private readonly environmentService: IEnvironmentService
  ) {
    super(
      instantiationService,
      lifecycleService,
      notificationService,
      telemetryService,
      fileService
    );

    this.lifecycleService.when(LifePhase.Ready).then(() => {
      if (this.environmentService.shouldActivateGlCore) {
        this._extHostExtensionService = this.instantiationService.createInstance(
          ExtHostExtensionService
        );
      }

      return this.initialize();
    });
  }

  protected async scanAndHandleExtensions(): Promise<void> {
    // TODO: remove timeout
    await timeout(1000);

    const staticExtensions = await this.staticExtensionService.getExtensions();

    if (this.environmentService.shouldActivateGlCore) {
      for (const extension of staticExtensions) {
        await this._extHostExtensionService.activateExtension(extension);
      }
    }

    this._registry.deltaExtensions(staticExtensions);
  }

  public dispose(): void {
    super.dispose();

    this._disposables.dispose();
  }
}
