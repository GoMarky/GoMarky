import { IWindowState } from '@/platform/window/electron-main/window';

export interface ILocalWorkspaceStorageSchema {
  name: string;

  description: string;

  /**
   * TODO:
   *  Create keymap config;
   */
  keymap: object;
  /**
   * TODO:
   *  Create settings config;
   */
  settings: object;

  windowState: IWindowState;

  lastEditedTexture: string;
}

export const GlobalStorageSchema = {
  projects: {
    type: 'array',
    default: [],
  },
  welcomeWindowState: {
    width: { type: 'number' },
    height: { type: 'number' },
    x: { type: 'number' },
    y: { type: 'number' },
    mode: { type: 'number' },
    display: { type: 'number' },
  },
};

export const LocalWorkspaceStorageSchema = {
  lastEditedTexture: {
    type: 'string',
    default: '',
  },
  name: {
    type: 'string',
    default: '',
  },
  description: {
    type: 'string',
    default: '',
  },
  keymap: {
    type: 'object',
    default: {},
  },
  settings: {
    type: 'object',
    default: {},
  },
  windowState: {
    width: { type: 'number' },
    height: { type: 'number' },
    x: { type: 'number' },
    y: { type: 'number' },
    mode: { type: 'number' },
    display: { type: 'number' },
  },
  labels: {
    type: 'object',
    default: {
      type: 'FeatureCollection',
      features: [],
    },
  },
};
