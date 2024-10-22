import { ChatInputCommandInteraction } from 'discord.js';
import { BaseClient } from '../../../../client';
import { BaseChatInputSubcommand } from '../../../../structures/BaseChatInputSubcommand';
import { CommandCategory } from '../../../../types/types';

export default class InfoSubcommand extends BaseChatInputSubcommand {
  constructor(client: BaseClient) {
    super(client, {
      name: 'info',
      description: 'Displays information about the example command.',
      category: CommandCategory.Utility,
      requiredApplicationPermissions: [],
      requiredMemberPermissions: [],
    });
  }

  public async onChatInputInteraction(
    i: ChatInputCommandInteraction<'cached'>,
  ): Promise<void> {
    await i.reply(
      'Use `/example settings toggle` for turning setting on or off.',
    );
  }
}
