import { createDecorator } from '@/platform/instantiation/common/instantiation';
import { IWindowState } from '@/platform/window/electron-main/window';
import { UnloadReason } from '@/platform/lifecycle/common/lifecycle';
import { Event } from '@/base/common/event';

export const IStateService = createDecorator<IStateService>('stateService');

export enum WillSaveStateReason {
  NONE = 0,
  SHUTDOWN = 1,
}

export interface IWillSaveStateEvent {
  reason: WillSaveStateReason;
}

export interface IStateService {
  readonly onWillSaveState: Event<IWillSaveStateEvent>;

  getItem<T>(key: keyof IStateServiceStorageSchema, defaultValue: T): T;

  getItem<T>(key: keyof IStateServiceStorageSchema, defaultValue?: T): T | undefined;

  setItem(
    key: keyof IStateServiceStorageSchema,
    data?: object | string | number | boolean | undefined | null,
    reason?: WillSaveStateReason
  ): void;

  removeItem(key: keyof IStateServiceStorageSchema): void;
}

export interface IStateServiceStorageSchema {
  projects: string[];
  pickerWorkingDir: string;
  windowsState: object | null;

  welcomeWindowState: IWindowState;
  lastShutdownReason: UnloadReason;
  sessionState: IRestoredSessionState;
}

export interface IRestoredSessionState {
  sessionId: string;
}
