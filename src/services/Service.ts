import { BaseClient } from '../client';

export abstract class Service {
  protected client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  public async init?(): Promise<void> {}

  public registerEvents?(): void {}
}
