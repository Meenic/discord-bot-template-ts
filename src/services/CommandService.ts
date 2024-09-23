import { Service } from './Service';
import { CustomClient } from '../client';
import { BaseCommand } from '../commands/BaseCommand';
import { Interaction } from 'discord.js';
import path from 'path';
import { readdirSync, statSync } from 'fs';

export class CommandService extends Service {
  private commands: Map<string, BaseCommand> = new Map();

  constructor(client: CustomClient) {
    super(client);
  }

  async init(): Promise<void> {
    await this.loadCommands();
  }

  public onClientReady(): void {
    this.client.on('interactionCreate', this.onInteractionCreate.bind(this));
  }

  private async onInteractionCreate(interaction: Interaction) {
    if (!interaction.isCommand()) return;

    const commandName = interaction.commandName;
    const command = this.commands.get(commandName);

    if (!command) {
      await interaction.reply({
        content: 'Command not found!',
        ephemeral: true,
      });
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error('Error executing command:', error);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: 'There was an error executing that command!',
          ephemeral: true,
        });
      }
    }
  }

  private async loadCommands(): Promise<void> {
    const commandsDir = path.join(__dirname, '../commands'); // Adjust path as needed
    await this.loadCommandsFromDir(commandsDir);
  }

  private async loadCommandsFromDir(dir: string): Promise<void> {
    const files = readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = statSync(filePath);

      if (stats.isDirectory()) {
        // Recursively load commands from the subdirectory
        await this.loadCommandsFromDir(filePath);
      } else if (file.endsWith('.ts') || file.endsWith('.js')) {
        const commandModule = await import(filePath);
        const commandClass = Object.values(commandModule).find((exported) => {
          return (
            typeof exported === 'function' &&
            exported.prototype instanceof BaseCommand
          );
        }) as new (client: CustomClient) => BaseCommand;

        if (commandClass) {
          const commandInstance = new commandClass(this.client);
          this.registerCommand(commandInstance);
        }
      }
    }
  }

  registerCommand(command: BaseCommand): void {
    if (this.commands.has(command.name)) {
      throw new Error(`Command ${command.name} is already registered.`);
    }

    this.commands.set(command.name, command);
    command.registerSlashCommand();
    this.log(`Command registered: ${command.name} command registered.`);
  }

  listCommands(): string[] {
    return Array.from(this.commands.keys());
  }
}
