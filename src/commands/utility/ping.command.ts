import { ChatInputCommandInteraction } from 'discord.js';
import { BaseClient } from '../../client';
import { CommandCategory } from '../../types/types';
import { BaseChatInputCommand } from '../../structures/BaseChatInputCommand';

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
    i: ChatInputCommandInteraction<'cached'>,
  ): Promise<void> {
    await i.deferReply({ ephemeral: false });

    const sentMessage = await i.fetchReply();

    const latency = sentMessage.createdTimestamp - i.createdTimestamp;

    await i.editReply(
      `🏓 Pong! Latency: \`${latency}ms\``,
    );
  }
}
