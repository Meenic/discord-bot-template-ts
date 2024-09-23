import {
  ApplicationCommandData,
  ApplicationCommandOptionData,
  REST,
  Routes,
} from 'discord.js';
import { CustomClient } from '../client';
import { CommandCategory, CommandName } from '../types/types';

interface CommandOptions {
  name: CommandName;
  description: string;
  category: CommandCategory;
  options?: Array<ApplicationCommandOptionData>;
}

export abstract class BaseCommand {
  protected client: CustomClient;

  public name: CommandName;
  public description: string;
  public category: CommandCategory;
  public options?: Array<ApplicationCommandOptionData>;

  constructor(
    client: CustomClient,
    { name, description, options, category }: CommandOptions,
  ) {
    this.client = client;

    this.name = name;
    this.description = description;
    this.options = options;
    this.category = category;
  }

  abstract execute(...args: any[]): Promise<void>;

  async registerSlashCommand(): Promise<void> {
    const commandData: ApplicationCommandData = {
      name: this.name,
      description: this.description,
      options: this.options,
    };

    const isDevelopment = process.env.NODE_ENV === 'development';
    const guildId = process.env.GUILD_ID;

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {
      if (isDevelopment && guildId) {
        await rest.put(
          Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
          {
            body: [commandData],
          },
        );
        console.log(
          `Slash command registered in guild ${guildId}: ${this.name}`,
        );
      } else {
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
          body: [commandData],
        });
        console.log(`Slash command registered globally: ${this.name}`);
      }
    } catch (error) {
      console.error(`Failed to register command ${this.name}:`, error);
    }
  }
}
