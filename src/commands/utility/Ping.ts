import { CommandInteraction } from 'discord.js';
import { CustomClient } from '../../client';
import { CommandCategory, CommandName } from '../../types/types';
import { BaseCommand } from '../BaseCommand';

export class PingCommand extends BaseCommand {
  constructor(client: CustomClient) {
    super(client, {
      name: CommandName.Ping,
      description: 'Replies with Pong! and shows latency.',
      category: CommandCategory.Utility,
    });
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.deferReply({ ephemeral: false });

    const sentMessage = await interaction.fetchReply();

    const latency = sentMessage.createdTimestamp - interaction.createdTimestamp;
    const apiLatency = Math.round(interaction.client.ws.ping);

    await interaction.editReply(
      `🏓 Pong! Latency: ${latency}ms | API Latency: ${apiLatency}ms`,
    );
  }
}
