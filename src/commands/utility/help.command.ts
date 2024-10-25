import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseClient } from '../../client';
import { CommandCategory } from '../../types/types';
import { BaseChatInputCommand } from '../../structures/BaseChatInputCommand';

export default class HelpCommand extends BaseChatInputCommand {
  constructor(client: BaseClient) {
    super(client, {
      name: 'help',
      description: 'Displays all available commands.',
      category: CommandCategory.Utility,
      subcommandClasses: [],
      subcommandGroupClasses: [],
      requiredApplicationPermissions: [],
      requiredMemberPermissions: [],
    });
  }

  async onChatInputInteraction(
    i: ChatInputCommandInteraction<'cached'>,
  ): Promise<void> {
    const embed = new EmbedBuilder().setTitle('Available Commands');

    // Separate commands by category
    Object.values(CommandCategory).forEach((category) => {
      const commandsInCategory: string[] = [];

      this.client.cmd.chatInputCommands.forEach((command) => {
        if (command.category === category) {
          const commandId = command.getCommandId();

          // Add subcommands or subcommand groups' subcommands to the list
          if (command.subcommands.size > 0) {
            command.subcommands.forEach((subcommand) => {
              commandsInCategory.push(
                this.formatCommand(command.name, commandId, subcommand.name),
              );
            });
          }

          if (command.subcommandGroups.size > 0) {
            command.subcommandGroups.forEach((group) => {
              group.subcommands.forEach((subcommand) => {
                commandsInCategory.push(
                  this.formatCommand(
                    command.name,
                    commandId,
                    group.name,
                    subcommand.name,
                  ),
                );
              });
            });
          }

          // If it's a standalone command, add it directly
          if (
            command.subcommands.size === 0 &&
            command.subcommandGroups.size === 0
          ) {
            commandsInCategory.push(
              this.formatCommand(command.name, commandId),
            );
          }
        }
      });

      // Add the category and commands to the embed
      if (commandsInCategory.length > 0) {
        embed.addFields({
          name: category,
          value: commandsInCategory.join(', '),
          inline: false,
        });
      }
    });

    await i.reply({ embeds: [embed], ephemeral: true });
  }

  // Formats a command string, with support for subcommands and subcommand groups
  private formatCommand(
    commandName: string,
    commandId?: string,
    subcommandName?: string,
    subSubcommandName?: string,
  ): string {
    if (!commandId) {
      return subcommandName && subSubcommandName
        ? `/${commandName} ${subcommandName} ${subSubcommandName}`
        : subcommandName
          ? `/${commandName} ${subcommandName}`
          : `/${commandName}`;
    }

    if (subcommandName && subSubcommandName) {
      return `</${commandName} ${subcommandName} ${subSubcommandName}:${commandId}>`;
    } else if (subcommandName) {
      return `</${commandName} ${subcommandName}:${commandId}>`;
    }
    return `</${commandName}:${commandId}>`;
  }
}
