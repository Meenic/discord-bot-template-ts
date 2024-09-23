import { Client, Events, GatewayIntentBits } from 'discord.js';
import { Service } from './services/Service';
import { CommandService } from './services/CommandService';

export class CustomClient extends Client {
  public services: Service[];

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.services = [new CommandService(this)];

    this.on(Events.ClientReady, this.onClientReady);
  }

  private onClientReady() {
    console.log(`[Client] Logged in as ${this.user?.tag}`);

    this.services.forEach((service) => {
      if (service.onClientReady) {
        service.onClientReady();
      }
    });

    console.log(
      `[Client] All services are ready and event listeners are bound.`,
    );
  }

  public async initServices() {
    for (const service of this.services) {
      await service.init();
      console.log(`[Client] Service ${service.constructor.name} initialized.`);
    }
    console.log(`[Client] All services initialized.`);
  }

  public async startBot() {
    await this.initServices();
  }
}
