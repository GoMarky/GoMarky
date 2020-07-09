/*---------------------------------------------------------------------------------------------
 *  Сервис сохранения состояний отдельных частей приложения после завершения работы программы.
 *
 *  Таких часть, например как:
 *      - текущая размечаемая картинка в приложение
 *--------------------------------------------------------------------------------------------*/

import {
  IStateService,
  IStateServiceStorageSchema,
  IWillSaveStateEvent,
  WillSaveStateReason,
} from '@/platform/state/common/state';

import { SingleStorage } from '@/platform/storage/electron-main/storage';
import { IEnvironmentService } from '@/platform/env/node/environmentService';
import { defaultWindowState } from '@/platform/window/electron-main/window';

import { UnloadReason } from '@/platform/lifecycle/common/lifecycle';
import { Emitter, Event } from '@/base/common/event';
import { Disposable } from '@/base/common/lifecycle';

export class StateService extends Disposable implements IStateService {
  private fileStorage: SingleStorage<IStateServiceStorageSchema>;

  private readonly _onWillSaveState = this._register(new Emitter<IWillSaveStateEvent>());
  public readonly onWillSaveState: Event<IWillSaveStateEvent> = this._onWillSaveState.event;

  constructor(@IEnvironmentService environmentService: IEnvironmentService) {
    super();

    this.fileStorage = new SingleStorage<IStateServiceStorageSchema>({
      name: 'gomarky-global',
      cwd: environmentService.userDataPath,
      schema: {
        projects: { type: 'array', default: [] },
        pickerWorkingDir: { type: 'string', default: '' },
        windowsState: { type: 'object' || null, default: {} },
        welcomeWindowState: { type: 'object', default: defaultWindowState() },
        lastShutdownReason: { type: 'number', default: UnloadReason.CLOSE },
        sessionState: { type: 'object', default: {} },
      },
    });
  }

  public getItem<T>(key: keyof IStateServiceStorageSchema, defaultValue: T): T;
  public getItem<T>(key: keyof IStateServiceStorageSchema, defaultValue?: T): T | undefined;
  public getItem(key: keyof IStateServiceStorageSchema, defaultValue?: any): any {
    return this.fileStorage.get(key, defaultValue);
  }

  public removeItem(key: keyof IStateServiceStorageSchema): void {
    return this.fileStorage.remove(key);
  }

  public setItem(
    key: keyof IStateServiceStorageSchema,
    data?: object | string | number | boolean | undefined | null,
    reason: WillSaveStateReason = WillSaveStateReason.NONE
  ): void {
    this._onWillSaveState.fire({ reason });

    return this.fileStorage.set(key, data);
  }
}
