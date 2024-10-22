import { ApplicationCommandOptionType } from 'discord.js';
import { BaseClient } from '../../../../client';
import { BaseChatInputSubcommandGroup } from '../../../../structures/BaseChatInputSubcommandGroup';
import { CommandCategory } from '../../../../types/types';
import SettingsSubcommandGroupToggleSubcommand from './toggle.subcommand';

export default class SettingsSubcommandGroup extends BaseChatInputSubcommandGroup {
  constructor(client: BaseClient) {
    super(client, {
      name: 'settings',
      description: 'Manage settings related to the example command.',
      category: CommandCategory.Utility,
      requiredApplicationPermissions: [],
      requiredMemberPermissions: [],
      subcommandClasses: [SettingsSubcommandGroupToggleSubcommand],
      type: ApplicationCommandOptionType.SubcommandGroup,
      options: [],
    });
  }
}
