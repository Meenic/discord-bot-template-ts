import { ChatInputCommandInteraction } from 'discord.js';
import { BaseClient } from '../../../client';
import { CommandCategory } from '../../../types/types';
import { BaseChatInputCommand } from '../../../structures/BaseChatInputCommand';

export default class PingCommand extends BaseChatInputCommand {
  constructor(client: BaseClient) {
    super(client, {
      name: 'ping',
      description: 'Replies with "Pong!" and shows latency.',
      category: CommandCategory.Utility,
      subcommandClasses: [],
      subcommandGroupClasses: [],
      requiredApplicationPermissions: [],
      requiredMemberPermissions: [],
    });
  }

  async onChatInputInteraction(
    interaction: ChatInputCommandInteraction<'cached'>,
  ): Promise<void> {
    await interaction.deferReply({ ephemeral: false });

    const sentMessage = await interaction.fetchReply();

    const latency = sentMessage.createdTimestamp - interaction.createdTimestamp;
    const apiLatency = Math.round(interaction.client.ws.ping);

    await interaction.editReply(
      `🏓 Pong! Latency: ${latency}ms | API Latency: ${apiLatency}ms`,
    );
  }
}
