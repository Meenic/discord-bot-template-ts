import {
  APIApplicationCommandInteractionDataSubcommandGroupOption,
  PermissionFlagsBits,
  PermissionResolvable,
  SlashCommandSubcommandGroupBuilder,
} from 'discord.js';
import { CommandCategory } from '../types/types';
import { BaseChatInputSubcommand } from './BaseChatInputSubcommand';
import { Constructor } from '../types/global';
import { BaseClient } from '../client';
import colorize from '../utils/colorize';

export abstract class BaseChatInputSubcommandGroup {
  public parentOf!: string;

  public readonly metadata: SlashCommandSubcommandGroupBuilder;
  public readonly subcommands: Map<string, BaseChatInputSubcommand> = new Map();
  public readonly subcommandClasses: Constructor<BaseChatInputSubcommand>[];

  public readonly name: string;
  public readonly description: string;
  public readonly category: CommandCategory;
  public readonly requiredApplicationPermissions: PermissionResolvable[];
  public readonly requiredMemberPermissions: PermissionResolvable[];

  constructor(
    protected client: BaseClient,
    options: BaseChatInputSubCommandGroupOptions,
  ) {
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

    this.subcommandClasses = options.subcommandClasses;

    this.metadata = this.buildSlashCommandSubcommandGroup();
  }

  private buildSlashCommandSubcommandGroup(): SlashCommandSubcommandGroupBuilder {
    return new SlashCommandSubcommandGroupBuilder()
      .setName(this.name)
      .setDescription(this.description);
  }

  public loadSubcommands() {
    const subCommandInstances = this.subcommandClasses.map(
      (SubCommand) => new SubCommand(this.client),
    );

    subCommandInstances.forEach((s) => {
      console.log(
        `[${colorize('Command Loader', 'red')}] Loaded subcommand "${colorize(`/${this.parentOf} ${this.name} ${s.name}`, 'green')}".`,
      );

      s.setParentOf(this.name);
      this.subcommands.set(s.name, s);
      this.metadata.addSubcommand(s.metadata);
    });

    // Clear the array for performance optimization
    this.subcommandClasses.splice(0);
  }

  setParentOf(name: string) {
    this.parentOf = name;
    console.log(
      `[${colorize('Command Loader', 'red')}] Set parent command of "${colorize(this.name, 'green')}" to "${colorize(name, 'magenta')}".`,
    );
  }
}

export interface BaseChatInputSubCommandGroupOptions
  extends APIApplicationCommandInteractionDataSubcommandGroupOption {
  name: string;
  description: string;
  category: CommandCategory;
  requiredApplicationPermissions: PermissionResolvable[];
  requiredMemberPermissions: PermissionResolvable[];
  subcommandClasses: Constructor<BaseChatInputSubcommand>[];
}
