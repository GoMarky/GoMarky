import { IMainProcessService } from '@/platform/ipc/electron-browser/mainProcessService';
import { IChannel } from '@/base/parts/ipc/common/ipc';
import { IMenubarData, IMenubarService } from '@/platform/menubar/common/menubar';

export class MenubarService implements IMenubarService {
  public readonly serviceBrand = IMenubarService;

  private channel: IChannel;

  constructor(@IMainProcessService mainProcessService: IMainProcessService) {
    this.channel = mainProcessService.getChannel('menubar');
  }

  public updateMenubar(windowId: number, menuData: IMenubarData): Promise<void> {
    return this.channel.call('updateMenubar', [windowId, menuData]);
  }
}
