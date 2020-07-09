import { Event } from '@/base/common/event';
import { FunctionLike } from '@/base/common/types';
import { IDisposable } from '@/base/common/lifecycle';
import { IServicesAccessor } from '@/platform/instantiation/common/instantiation';
import { CommandImpl } from '@/platform/commands/electron-browser/commands';

export interface ICommandExecuteBody {
  execute: FunctionLike;
  undo?: FunctionLike;
}

export class CommandError extends Error {
  public readonly name = 'CommandError';
}

export type ICommandFuncBody = (...args: any[]) => ICommandExecuteBody;

export interface ICommand {
  id: string;
  method: ICommandFuncBody;
  description: ICommandHandlerDescription;
}

export type ICommandsMap = Map<string, ICommand>;

export interface ICommandHandlerDescription {
  description: string;
  args: any[];
  returns?: string;
}

export interface IExecuteCommandInRenderer {
  id: string;
}

export interface ICommandRegistry {
  onDidRegisterCommand: Event<string>;

  registerCommand(command: ICommand): IDisposable;
  registerCommand(id: string, command: (accessor: IServicesAccessor) => CommandImpl): IDisposable;

  getCommand(id: string): ICommand | undefined;
  hasCommand(id: string): boolean;
  getCommands(): ICommandsMap;
}

export interface ICommandEvent {
  commandId: string;
  args: any[];
}

export interface ICommandUndoEvent {
  commandId: string;
  args: any[];
}
