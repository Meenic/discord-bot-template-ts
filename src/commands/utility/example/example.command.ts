import { BaseClient } from '../../../client';
import { CommandCategory } from '../../../types/types';
import { BaseChatInputCommand } from '../../../structures/BaseChatInputCommand';
import InfoSubcommand from './subcommands/info.subcommand';
import SettingsSubcommandGroup from './subcommandgroups/settings.subcommandgroup';

export default class ExampleCommand extends BaseChatInputCommand {
  constructor(client: BaseClient) {
    super(client, {
      name: 'example',
      description: 'An example command for demonstration purposes.',
      category: CommandCategory.Utility,
      subcommandClasses: [InfoSubcommand],
      subcommandGroupClasses: [SettingsSubcommandGroup],
      requiredApplicationPermissions: [],
      requiredMemberPermissions: [],
    });
  }
}
