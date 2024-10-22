import {
  SlashCommandSubcommandBuilder,
  ChatInputCommandInteraction,
} from 'discord.js';
import {
  RootChatInputCommand,
  RootChatInputCommandOptions,
} from './RootChatInputCommand';
import { BaseClient } from '../client';

export abstract class BaseChatInputSubcommand extends RootChatInputCommand {
  public parentOf!: string;

  public readonly metadata: SlashCommandSubcommandBuilder;

  constructor(client: BaseClient, options: BaseChatInputSubCommandOptions) {
    super(client, options);

    this.metadata = this.buildSlashCommandSubcommand();
  }

  public abstract onChatInputInteraction(
    i: ChatInputCommandInteraction<'cached'>,
  ): Promise<void>;

  private buildSlashCommandSubcommand(): SlashCommandSubcommandBuilder {
    return new SlashCommandSubcommandBuilder()
      .setName(this.name)
      .setDescription(this.description);
  }

  setParentOf(name: string) {
    this.parentOf = name;
  }
}

export interface BaseChatInputSubCommandOptions
  extends RootChatInputCommandOptions {}
