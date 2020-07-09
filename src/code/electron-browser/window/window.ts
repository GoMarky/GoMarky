import { RawContextKey } from '@/platform/contextkey/common/contextkey';

export const WindowHasFocusContext = new RawContextKey<boolean>('windowHasFocus', false);
