import { CustomClient } from '../client';

export abstract class Service {
  protected client: CustomClient;

  constructor(client: CustomClient) {
    this.client = client;
  }

  abstract init(): Promise<void>;

  public onClientReady(): void {}

  protected log(message: string) {
    console.log(`[Service] ${this.constructor.name}: ${message}`);
  }
}
