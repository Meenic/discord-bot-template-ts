# ⚡ Discord Bot Template (TypeScript)

This repository offers a robust template for developing a Discord bot using TypeScript and the `discord.js` library. It features a modular service-loading system, comprehensive command handling with support for slash commands, and more!

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Database Setup with Prisma](#database-setup-with-prisma)
- [Command Structure](#command-structure)
- [Usage](#usage)
- [Contributing](#contributing)

## Features

- Modular architecture with organized services and commands.
- Easy registration and execution of slash commands.
- Efficient client event handling for a seamless user experience.
- Configurable environment settings for flexibility.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (recommended: v16 or higher)
- [TypeScript](https://www.typescriptlang.org/)
- [Discord.js](https://discord.js.org/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Meenic/discord-bot-template-ts.git
   cd discord-bot-template-ts
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and populate it with your bot's configuration.

## Database Setup with Prisma

This template uses [Prisma](https://www.prisma.io/) as the ORM for database management. Follow these steps to set up your database:

1. **Configure your `.env` file:**

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
   ```

   For SQLite (for quick development):

   ```env
   DATABASE_URL="file:./dev.db"
   ```

2. **Run migrations:**

   ```bash
   npx prisma migrate dev --name init
   ```

3. **Generate the Prisma client:**

   ```bash
   npx prisma generate
   ```

## Command Structure

Commands are organized within the `commands` directory, where each command extends `BaseChatInputCommand`, `BaseChatInputSubcommand`, or `BaseChatInputSubcommandGroup`, implementing the `onChatInputInteraction` method as necessary. Explore the commands folder for a clear layout. Here’s an example of a simple command:

```typescript
export default class PingCommand extends BaseChatInputCommand {
  constructor(client: BaseClient) {
    super(client, {
      name: 'ping',
      description: 'Replies with "Pong!" and shows latency.',
      category: CommandCategory.Utility,
      // Additional options can go here
    });
  }

  async onChatInputInteraction(i: ChatInputCommandInteraction<'cached'>): Promise<void> {
    // Your code goes here to handle the interaction
  }
}
```

## Usage

To start your bot, run the following command:

```bash
npm run start
```

Ensure that your environment variables are configured correctly before launching the bot.

## Contributing

Contributions are encouraged! If you encounter issues or wish to enhance the bot, feel free to fork the repository and submit a pull request.
