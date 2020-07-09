import { Disposable } from '@/base/common/lifecycle';
import { IMainProcessService } from '@/platform/ipc/electron-browser/mainProcessService';
import { IChannel } from '@/base/parts/ipc/common/ipc';
import {
  IKeybindingItem,
  IKeyboardRendererService,
  IKeyCodeItem,
  ISingleKeybindingItem,
} from '@/platform/keyboard/common/keyboard';
import { createDecorator } from '@/platform/instantiation/common/instantiation';

export const IKeyboardService = createDecorator<IKeyboardRendererService>('keyboardService');

export class KeyboardService extends Disposable implements IKeyboardRendererService {
  private channel: IChannel;
  private _coreKeybindings: IKeybindingItem[] = [];
  private _cachedMergedKeybindings: IKeybindingItem[] = [];
  private _extensionKeybindings: IKeybindingItem[] = [];

  public readonly serviceBrand = IKeyboardService;

  constructor(@IMainProcessService mainProcessService: IMainProcessService) {
    super();

    this.channel = mainProcessService.getChannel('keyboard');
  }

  public getDefaultKeybindings(): IKeybindingItem[] {
    return this._coreKeybindings;
  }

  public async registerShortcut(keybinding: IKeybindingItem): Promise<void> {
    this._coreKeybindings.push(keybinding);

    return this.channel.call('registerShortcut', [
      {
        accelerator: keybinding.accelerator,
        autoRepeat: keybinding.autoRepeat,
        id: keybinding.id,
      },
    ]);
  }

  public async registerShortcutCommandAlias(
    _accelerator: string,
    _commandAlias: string
  ): Promise<void> {}

  public registerKeyCode(keybinding: ISingleKeybindingItem): Promise<void> {
    this._coreKeybindings.push(keybinding);

    const keyCodeItem: IKeyCodeItem = {
      trigger: keybinding.trigger,
      accelerator: keybinding.accelerator,
      autoRepeat: keybinding.autoRepeat,
      id: keybinding.id,
    };

    return this.channel.call('registerKeyCode', [keyCodeItem]);
  }
}
