import { createDecorator } from '@/platform/instantiation/common/instantiation';

export interface IPreferencesService {
  getCommonlyUsedSettings(): string[];
}

export const IPreferencesService = createDecorator<IPreferencesService>(
  'preferencesRendererService'
);

export interface ISettingsGroup {
  id: string;
}
