# ⚡ Discord Bot Template TypeScript

This repository provides a structured template for building a Discord bot using TypeScript and the `discord.js` library. It includes a modular service-loading system, command handling with support for slash commands, and more!

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Command Structure](#command-structure)
- [Usage](#usage)
- [Contributing](#contributing)

## Features

- Modular architecture with services and commands.
- Slash command registration and execution.
- Client event handling for a smooth bot experience.
- Configurable environment settings.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [TypeScript](https://www.typescriptlang.org/)
- [Discord.js](https://discord.js.org/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/discord-typescript-bot-template.git
   cd discord-typescript-bot-template
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and fill in your bot's configuration.

## Command Structure

Commands are organized in the `commands` directory. Each command should extend the `BaseCommand` class and implement the `execute` method. Here's an example of a simple command:

    ```typescript
    export class PingCommand extends BaseCommand {
        constructor(client: BMClient) {
            super(client, {
            name: 'ping',
            description: 'Replies with Pong! and shows latency.',
            category: 'Utility',
            });
        }

        async execute(interaction: CommandInteraction): Promise<void> {
            await interaction.deferReply({ ephemeral: false });
            const sentMessage = await interaction.fetchReply();
            const latency = sentMessage.createdTimestamp - interaction.createdTimestamp;
            const apiLatency = Math.round(interaction.client.ws.ping);

            await interaction.editReply(
            `🏓 Pong! Latency: ${latency}ms | API Latency: ${apiLatency}ms`,
            );
        }
    }
    ```

## Usage

To run your bot, execute the following command:

    ```bash
    npm run start
    ```

Make sure you have set up your environment variables before starting the bot.

## Contributing

Contributions are welcome! If you find any issues or want to enhance the bot, feel free to fork the repository and submit a pull request.