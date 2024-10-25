import { Client, Events, GatewayIntentBits, Guild } from 'discord.js';
import { CommandService } from './services/CommandService';
import { DatabaseService } from './services/DatabaseService';

interface ServiceMap {
  command: CommandService;
  database: DatabaseService;
}

export class BaseClient extends Client {
  public services: ServiceMap;

  public cmd: CommandService;
  public db: DatabaseService;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.services = {
      command: new CommandService(this),
      database: new DatabaseService(this),
    };

    this.cmd = this.services.command;
    this.db = this.services.database;

    this.on(Events.ClientReady, this.onClientReady);
    this.on(Events.GuildCreate, this.onGuildCreate);
    this.on(Events.GuildDelete, this.onGuildDelete);
  }

  private onClientReady() {
    console.log(`[Client] Logged in as ${this.user?.tag}`);

    Object.values(this.services).forEach((service) => {
      if (service.registerEvents) {
        service.registerEvents();
      }
    });

    console.log(
      '[Client] All services are ready and event listeners are bound.',
    );
  }

  public async initServices() {
    for (const service of Object.values(this.services)) {
      if (service.init) {
        await service.init();
      }
      console.log(`[Client] Service ${service.constructor.name} initialized.`);
    }
    console.log('[Client] All services initialized.');
  }

  private async onGuildCreate(guild: Guild) {
    console.log(`[Client] Joined new guild: ${guild.name} (${guild.id})`);
    try {
      await this.services.database.saveOrUpdateGuild(guild);
    } catch (error) {
      console.error(
        `[Client] Error saving guild ${guild.name} (${guild.id}):`,
        error,
      );
    }
  }

  private async onGuildDelete(guild: Guild) {
    console.log(`[Client] Left guild: ${guild.name} (${guild.id})`);
    try {
      await this.services.database.updateGuildStatus(guild.id, 'inactive');
      console.log(
        `[Client] Guild ${guild.name} (${guild.id}) marked as inactive in database.`,
      );
    } catch (error) {
      console.error(
        `[Client] Error updating guild status ${guild.name} (${guild.id}):`,
        error,
      );
    }
  }

  public async startBot() {
    await this.initServices();
  }
}
