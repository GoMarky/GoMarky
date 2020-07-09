import { Disposable } from '@/base/common/lifecycle';
import { ISessionLoginCredentials, ISessionService } from '@/platform/session/common/session';
import { IMainProcessService } from '@/platform/ipc/electron-browser/mainProcessService';

import { IChannel } from '@/base/parts/ipc/common/ipc';

export class SessionService extends Disposable implements ISessionService {
  private channel: IChannel;

  constructor(@IMainProcessService mainProcessService: IMainProcessService) {
    super();

    this.channel = mainProcessService.getChannel('session');
  }

  public async login(credentials: ISessionLoginCredentials): Promise<void> {
    return this.channel.call('login', credentials);
  }

  public async logout(): Promise<void> {
    return this.channel.call('logout');
  }

  public serviceBrand: ISessionService;
}
