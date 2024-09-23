// Commands
export interface Command {
  name: string;
  description: string;
  execute(...args: any[]): Promise<void>;
}

export enum CommandName {
  Ping = 'ping',
}

export enum CommandCategory {
  Utility = 'Utility',
}

// Services
export interface Service {
  init(): Promise<void>;
  bindEvents(): void;
}
