import { IServerChannel } from '@/base/parts/ipc/common/ipc';
import { Event } from '@/base/common/event';
import { IStateService, IWillSaveStateEvent } from '@/platform/state/common/state';

const calls = {
  setItem: 'setItem',
  getItem: 'getItem',
  removeItem: 'removeItem',
};

const events = {
  onWillSaveState: { name: 'onWillSaveState', toAll: true },
};

export class StateServiceChannel implements IServerChannel {
  public readonly calls = calls;
  public readonly events = events;

  private readonly onWillSaveState: Event<IWillSaveStateEvent>;

  constructor(@IStateService private readonly service: IStateService) {
    this.onWillSaveState = Event.bumper(service.onWillSaveState);
  }

  public listen(_: unknown, event: string): Event<any> {
    switch (event) {
      case events.onWillSaveState.name:
        return this.onWillSaveState;
    }

    throw new Error(`Event not found: ${event}`);
  }

  public async call(command: string, arg?: any): Promise<any> {
    switch (command) {
      case calls.setItem:
        return this.service.setItem(arg[0], arg[1], arg[2]);
      case calls.getItem:
        return this.service.getItem(arg[0], arg[1]);
      case calls.removeItem:
        return this.service.removeItem(arg);
    }

    throw new Error(`Call not found: ${command}`);
  }
}
