import { createDecorator } from '@/platform/instantiation/common/instantiation';
import { ISessionInfo, ISessionLoginCredentials } from '@/platform/session/common/session';

export const ISessionMainService = createDecorator<ISessionMainService>('sessionMainService');

export interface ISessionMainService {
  configuration: ISessionInfo;

  restoreSession(): Promise<void>;

  login(credentials: ISessionLoginCredentials): Promise<void>;

  logout(): Promise<void>;
}
