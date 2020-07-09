import { createDecorator } from '@/platform/instantiation/common/instantiation';
import { Event } from '@/base/common/event';

export interface IExtensionService {
  onDidRegisterExtensions: Event<void>;
  onWillActivateByEvent: Event<IWillActivateEvent>;

  whenInstalledExtensionsRegistered(): Promise<boolean>;
}

export interface IWillActivateEvent {
  readonly event: string;
  readonly activation: Promise<void>;
}

export const IExtensionService = createDecorator<IExtensionService>('extensionService');
