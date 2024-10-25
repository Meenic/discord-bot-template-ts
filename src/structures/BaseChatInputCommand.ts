import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ChatInputApplicationCommandData,
} from 'discord.js';
import {
  RootChatInputCommand,
  RootChatInputCommandOptions,
} from './RootChatInputCommand';
import { BaseClient } from '../client';
import { Constructor } from '../types/global';
import {
  BaseChatInputSubcommand,
  BaseChatInputSubCommandOptions,
} from './BaseChatInputSubcommand';
import { BaseChatInputSubcommandGroup } from './BaseChatInputSubcommandGroup';
import colorize from '../utils/colorize';

export abstract class BaseChatInputCommand extends RootChatInputCommand {
  public readonly metadata: SlashCommandBuilder;

  public readonly subcommands: Map<string, BaseChatInputSubCommandOptions> =
    new Map();

  public readonly subcommandGroups: Map<string, BaseChatInputSubcommandGroup> =
    new Map();

  private readonly subcommandClasses: Constructor<BaseChatInputSubcommand>[];

  private readonly subcommandGroupClasses: Constructor<BaseChatInputSubcommandGroup>[];

  constructor(client: BaseClient, options: BaseChatInputCommandOptions) {
    super(client, options);

    this.subcommandClasses = options.subcommandClasses;
    this.subcommandGroupClasses = options.subcommandGroupClasses;

    this.metadata = this.buildSlashCommand();
  }

  public async onChatInputInteraction(
    _i: ChatInputCommandInteraction<'cached'>,
  ): Promise<void> {
    throw new Error('Function not implemented');
  }

  private buildSlashCommand(): SlashCommandBuilder {
    const slashCommand = new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description);

    const subCommandInstances = this.subcommandClasses.map(
      (SubCommand) => new SubCommand(this.client),
    );

    subCommandInstances.forEach((s) => {
      console.log(
        `[${colorize('Command Loader', 'red')}] Loaded subcommand "${colorize(`/${this.name} ${s.name}`, 'green')}".`,
      );

      s.setParentOf(this.name);

      this.subcommands.set(s.name, s);
      slashCommand.addSubcommand(s.metadata);
    });

    const subCommandGroupInstances = this.subcommandGroupClasses.map(
      (SubCommandGroup) => new SubCommandGroup(this.client),
    );

    subCommandGroupInstances.forEach((s) => {
      console.log(
        `[${colorize('Command Loader', 'red')}] Loaded subcommand group "${colorize(`/${this.name} ${s.name}`, 'green')}".`,
      );

      s.setParentOf(this.name);

      this.subcommandGroups.set(s.name, s);
      s.loadSubcommands(); // This will also log individual subcommands within the group.
      slashCommand.addSubcommandGroup(s.metadata);
    });

    // Clear arrays for optimization
    this.subcommandClasses.splice(0);
    this.subcommandGroupClasses.splice(0);

    return slashCommand;
  }
}

export interface BaseChatInputCommandOptions
  extends RootChatInputCommandOptions<ChatInputApplicationCommandData> {
  subcommandClasses: Constructor<BaseChatInputSubcommand>[];
  subcommandGroupClasses: Constructor<BaseChatInputSubcommandGroup>[];
}
