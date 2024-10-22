import { PermissionResolvable, PermissionFlagsBits } from 'discord.js';
import { BaseClient } from '../client';
import { CommandCategory } from '../types/types';

export abstract class RootChatInputCommand {
  private commandId?: string;

  public readonly name: string;
  public readonly description: string;
  public readonly category: CommandCategory;
  public readonly requiredApplicationPermissions: PermissionResolvable[];
  public readonly requiredMemberPermissions: PermissionResolvable[];

  constructor(
    protected readonly client: BaseClient,
    readonly options: RootChatInputCommandOptions,
  ) {
    this.client = client;
    this.name = options.name;
    this.description = options.description;
    this.category = options.category;

    this.requiredApplicationPermissions = [
      PermissionFlagsBits.SendMessages,
      PermissionFlagsBits.EmbedLinks,
      ...options.requiredApplicationPermissions,
    ];
    this.requiredMemberPermissions = [
      PermissionFlagsBits.SendMessages,
      ...options.requiredMemberPermissions,
    ];
  }

  public getCommandId(): string | undefined {
    return this.commandId;
  }

  public setCommandId(id: string): void {
    this.commandId = id;
  }
}

export type RootChatInputCommandOptions<T = unknown> = {
  name: string;
  description: string;
  category: CommandCategory;
  requiredApplicationPermissions: PermissionResolvable[];
  requiredMemberPermissions: PermissionResolvable[];
} & T;
