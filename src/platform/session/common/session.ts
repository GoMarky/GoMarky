import { createDecorator } from '@/platform/instantiation/common/instantiation';

export class SessionError extends Error {}

export interface ISessionInfo {
  clientId: number;
  sessionId: string;
  profile: {
    name: string;
    email: string;
  };
}

export interface ISessionInfoRequestResponse {
  result: string;
  session: ISessionInfo;
}

export interface ISessionLoginCredentials {
  email: string;
  password: string;
}

export const ISessionService = createDecorator<ISessionService>('sessionService');

export interface ISessionService {
  login(credentials: ISessionLoginCredentials): Promise<void>;

  logout(): Promise<void>;
}
