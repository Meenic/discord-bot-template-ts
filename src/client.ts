import { Client, Events, GatewayIntentBits } from 'discord.js';
import { CommandService } from './services/CommandService';

interface ServiceMap {
  command: CommandService;
}

export class BaseClient extends Client {
  public services: ServiceMap;

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
    };

    this.on(Events.ClientReady, this.onClientReady);
  }

  private onClientReady() {
    console.log(`[Client] Logged in as ${this.user?.tag}`);

    Object.values(this.services).forEach((service) => {
      if (service.registerEvents) {
        service.registerEvents();
      }
    });

    console.log(
      `[Client] All services are ready and event listeners are bound.`,
    );
  }

  public async initServices() {
    for (const service of Object.values(this.services)) {
      if (service.init) {
        await service.init();
      }
      console.log(`[Client] Service ${service.constructor.name} initialized.`);
    }
    console.log(`[Client] All services initialized.`);
  }

  public async startBot() {
    await this.initServices();
  }
}
