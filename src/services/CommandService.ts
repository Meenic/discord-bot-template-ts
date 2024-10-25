import { Service } from './Service';
import { BaseClient } from '../client';
import { BaseChatInputCommand } from '../structures/BaseChatInputCommand';
import {
  ChatInputCommandInteraction,
  GuildMember,
  Interaction,
  REST,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
} from 'discord.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { BaseChatInputSubcommandGroup } from '../structures/BaseChatInputSubcommandGroup';
import { BaseChatInputSubcommand } from '../structures/BaseChatInputSubcommand';
import colorize from '../utils/colorize';

export class CommandService extends Service {
  public readonly chatInputCommands = new Map<string, BaseChatInputCommand>();

  async init(): Promise<void> {
    await this.loadChatInputCommands();

    await this.registerChatInputCommandsToAPI();
  }

  public registerEvents(): void {
    this.client.on('interactionCreate', this.onInteractionCreate.bind(this));
  }

  private async loadChatInputCommands(
    dir: string = path.join(__dirname, '../commands'),
  ): Promise<void> {
    const files = await fs.readdir(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = await fs.stat(filePath);

      if (stats.isDirectory()) {
        // Recursively load commands from the subdirectory
        await this.loadChatInputCommands(filePath);
      } else if (file.endsWith('.command.ts') || file.endsWith('.command.js')) {
        try {
          const commandModule = await import(filePath);
          const commandClass = Object.values(commandModule).find((exported) => {
            return (
              typeof exported === 'function' &&
              exported.prototype instanceof BaseChatInputCommand
            );
          }) as new (client: BaseClient) => BaseChatInputCommand;

          if (commandClass) {
            const commandInstance = new commandClass(this.client);

            if (this.chatInputCommands.has(commandInstance.name)) {
              console.warn(
                `[${colorize('Command Loader', 'red')}] Duplicate command detected: "${colorize(`/${commandInstance.name}`, 'yellow')}". Skipping registration.`,
              );
            } else {
              this.chatInputCommands.set(commandInstance.name, commandInstance);
              console.log(
                `[${colorize('Command Loader', 'red')}] Successfully loaded command "${colorize(`/${commandInstance.name}`, 'green')}". Source file: "${colorize(path.relative(process.cwd(), filePath), 'cyan')}".`,
              );
            }
          } else {
            console.error(
              `[${colorize('Command Loader', 'red')}] No valid command class found in file: "${colorize(path.relative(process.cwd(), filePath), 'cyan')}".`,
            );
          }
        } catch (error) {
          console.error(
            `[${colorize('Command Loader', 'red')}] Error loading command from file: "${colorize(path.relative(process.cwd(), filePath), 'cyan')}".`,
            error,
          );
        }
      }
    }
  }

  private async registerChatInputCommandsToAPI(): Promise<void> {
    const slashCommands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

    // Prepare the slash commands to register
    this.chatInputCommands.forEach((command) => {
      slashCommands.push(command.metadata.toJSON());
    });

    console.log(
      `Preparing to register ${slashCommands.length} application (/) command(s)`,
    );

    const isDevelopment = process.env.NODE_ENV === 'development';
    const guildId = process.env.GUILD_ID;

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {
      let registeredCommands;

      // Register commands based on the environment (development or production)
      if (isDevelopment && guildId) {
        registeredCommands = await rest.put(
          Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
          {
            body: slashCommands,
          },
        );
        console.log(
          `Successfully registered ${slashCommands.length} commands in development guild: ${guildId}.`,
        );
      } else {
        registeredCommands = await rest.put(
          Routes.applicationCommands(process.env.CLIENT_ID),
          {
            body: slashCommands,
          },
        );
        console.log(
          `Successfully registered ${slashCommands.length} commands globally.`,
        );
      }

      // Set the command IDs after registration
      if (Array.isArray(registeredCommands)) {
        registeredCommands.forEach((registeredCommand) => {
          const matchingCommand = this.chatInputCommands.get(
            registeredCommand.name,
          );
          if (matchingCommand) {
            matchingCommand.setCommandId(registeredCommand.id);
          }
        });
      }

      console.log('Command IDs have been set successfully.');
    } catch (error) {
      console.error('Error occurred while registering commands:', error);
    }
  }

  private async onInteractionCreate(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    let guild = interaction.guild;
    let member = interaction.member as GuildMember;
    const user = interaction.user;

    if (!guild) {
      console.warn(
        `Guild is missing for interaction with ID: ${interaction.id}`,
      );
      await interaction.reply({
        content: 'This command can only be used within a server.',
        ephemeral: true,
      });
      return;
    }

    let me = guild.members.me || null;

    if (!me) {
      try {
        me = await guild.members.fetchMe();
      } catch (error) {
        console.warn(
          `Failed to fetch the bot's member object in guild: ${guild.id}`,
        );
        await this.handleInteractionError(
          interaction,
          'An error occurred while trying to fetch bot information. Please try again later.',
        );
        return;
      }
    }

    if (!member) {
      try {
        member = await guild.members.fetch(user.id);
      } catch (error) {
        console.warn(
          `Failed to fetch member for user ID: ${user.id} in guild: ${guild.id}`,
        );
        await this.handleInteractionError(
          interaction,
          'Could not retrieve member information. Please try again later.',
        );
        return;
      }
    }

    const { commandName, options } = interaction;
    const command = this.chatInputCommands.get(
      commandName,
    ) as BaseChatInputCommand;

    if (!command) {
      console.warn(`Received unknown command: ${commandName}`);
      await this.handleInteractionError(
        interaction,
        'This command is not recognized or may no longer be available.',
      );
      return;
    }

    try {
      const missingMemberPermissions = command.requiredMemberPermissions.filter(
        (perm) => !member.permissions.has(perm),
      );
      const missingBotPermissions =
        command.requiredApplicationPermissions.filter(
          (perm) => !me.permissions.has(perm),
        );

      if (missingMemberPermissions.length > 0) {
        await this.handleInteractionError(
          interaction,
          `You lack the following permissions to execute this command: ${missingMemberPermissions.join(', ')}`,
        );
        return;
      }

      if (missingBotPermissions.length > 0) {
        await this.handleInteractionError(
          interaction,
          `I lack the following permissions to execute this command: ${missingBotPermissions.join(', ')}`,
        );
        return;
      }

      const subcommandGroupName = options.getSubcommandGroup(false);
      if (subcommandGroupName) {
        const subcommandGroup = command.subcommandGroups.get(
          subcommandGroupName,
        ) as BaseChatInputSubcommandGroup;
        if (!subcommandGroup) {
          console.warn(
            `Unknown subcommand group: ${subcommandGroupName} in command /${commandName}`,
          );
          await this.handleInteractionError(
            interaction,
            'This subcommand group is not recognized or may no longer be available.',
          );
          return;
        }

        const subcommandName = options.getSubcommand();
        const subcommand = subcommandGroup.subcommands.get(subcommandName);
        if (!subcommand) {
          console.warn(
            `Unknown subcommand: ${subcommandName} in group /${commandName} ${subcommandGroupName}`,
          );
          await this.handleInteractionError(
            interaction,
            'This subcommand is not recognized or may no longer be available.',
          );
          return;
        }

        await subcommand.onChatInputInteraction(
          interaction as ChatInputCommandInteraction<'cached'>,
        );
        return;
      }

      const subcommandName = options.getSubcommand(false);
      if (subcommandName) {
        const subcommand = command.subcommands.get(
          subcommandName,
        ) as BaseChatInputSubcommand;
        if (!subcommand) {
          console.warn(
            `Unknown subcommand: ${subcommandName} in command /${commandName}`,
          );
          await this.handleInteractionError(
            interaction,
            'This subcommand is not recognized or may no longer be available.',
          );
          return;
        }

        // Execute the subcommand.
        await subcommand.onChatInputInteraction(
          interaction as ChatInputCommandInteraction<'cached'>,
        );
        return;
      }

      await command.onChatInputInteraction(
        interaction as ChatInputCommandInteraction<'cached'>,
      );
    } catch (error) {
      console.error(`Error executing command /${commandName}:`, error);
      await this.handleInteractionError(
        interaction,
        'An error occurred while executing the command. Please try again later.',
      );
    }
  }

  private async handleInteractionError(
    interaction: ChatInputCommandInteraction,
    message: string,
  ) {
    // Check if the interaction has already been replied to or deferred
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: message, ephemeral: true });
    } else {
      await interaction.reply({ content: message, ephemeral: true });
    }
  }
}
