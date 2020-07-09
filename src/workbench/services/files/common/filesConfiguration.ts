import { createDecorator } from '@/platform/instantiation/common/instantiation';
import { Disposable } from '@/base/common/lifecycle';
import { AutoSaveConfiguration } from '@/platform/files/common/files';
import { registerSingleton } from '@/platform/instantiation/common/singleton';
import {
  IContextKey,
  IContextKeyService,
  RawContextKey,
} from '@/platform/contextkey/common/contextkey';

export const enum AutoSaveMode {
  OFF,
  AFTER_SHORT_DELAY,
  AFTER_LONG_DELAY,
  ON_FOCUS_CHANGE,
  ON_WINDOW_CHANGE,
}

export const enum SaveReason {
  EXPLICIT = 1,
  AUTO = 2,
  FOCUS_CHANGE = 3,
  WINDOW_CHANGE = 4,
}

export interface IFilesConfigurationService {
  getAutoSaveMode(): AutoSaveMode;
}

export const IFilesConfigurationService = createDecorator<IFilesConfigurationService>(
  'filesConfigurationService'
);

export const AutoSaveAfterShortDelayContext = new RawContextKey<boolean>(
  'autoSaveAfterShortDelayContext',
  false
);

export class FilesConfigurationService extends Disposable implements IFilesConfigurationService {
  private configuredAutoSaveDelay?: number;
  private configuredAutoSaveOnFocusChange: boolean | undefined;
  private configuredAutoSaveOnWindowChange: boolean | undefined;

  private static DEFAULT_AUTO_SAVE_MODE = AutoSaveConfiguration.OFF;

  private autoSaveShortDelayContext: IContextKey<boolean>;

  constructor(@IContextKeyService contextKeyService: IContextKeyService) {
    super();

    this.autoSaveShortDelayContext = AutoSaveAfterShortDelayContext.bindTo(contextKeyService);
  }

  public getAutoSaveMode(): AutoSaveMode {
    if (this.configuredAutoSaveOnFocusChange) {
      return AutoSaveMode.ON_FOCUS_CHANGE;
    }

    if (this.configuredAutoSaveOnWindowChange) {
      return AutoSaveMode.ON_WINDOW_CHANGE;
    }

    return AutoSaveMode.OFF;
  }
}

registerSingleton(IFilesConfigurationService, FilesConfigurationService);
