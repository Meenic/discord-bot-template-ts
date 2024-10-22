import { ChatInputCommandInteraction } from 'discord.js';
import { BaseClient } from '../../../../client';
import { BaseChatInputSubcommand } from '../../../../structures/BaseChatInputSubcommand';
import { CommandCategory } from '../../../../types/types';

export default class SettingsSubcommandGroupToggleSubcommand extends BaseChatInputSubcommand {
  constructor(client: BaseClient) {
    super(client, {
      name: 'toggle',
      description: 'Toggles a setting on or off.',
      category: CommandCategory.Utility,
      requiredApplicationPermissions: [],
      requiredMemberPermissions: [],
    });
  }

  public async onChatInputInteraction(
    i: ChatInputCommandInteraction<'cached'>,
  ): Promise<void> {
    const currentStatus = Math.random() < 0.5;
    const newStatus = !currentStatus;
    await i.reply(`The setting has been turned ${newStatus ? 'on' : 'off'}.`);
  }
}
