import { PrismaClient } from '@prisma/client';
import { Service } from './Service';
import { Guild } from 'discord.js';
import { BaseClient } from '../client';

export class DatabaseService extends Service {
  public prisma: PrismaClient;

  constructor(client: BaseClient) {
    super(client);
    this.prisma = new PrismaClient();
  }

  public async init(): Promise<void> {
    try {
      await this.prisma.$connect();
      console.log('[DatabaseService] Connected to the database.');
    } catch (error) {
      console.error(
        '[DatabaseService] Failed to connect to the database:',
        error,
      );
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
    console.log('[DatabaseService] Disconnected from the database.');
  }

  public async updateGuildStatus(
    guildId: string,
    status: 'active' | 'inactive',
  ): Promise<void> {
    try {
      await this.prisma.guild.update({
        where: { id: guildId }, // Use 'id' as specified in the model
        data: { status },
      });
      console.log(
        `[DatabaseService] Guild status updated to ${status} for guild (${guildId}).`,
      );
    } catch (error) {
      console.error(
        `[DatabaseService] Failed to update status for guild (${guildId}):`,
        error,
      );
    }
  }

  public async saveOrUpdateGuild(guild: Guild): Promise<void> {
    try {
      await this.prisma.guild.upsert({
        where: { id: guild.id }, // Use 'id' for unique identification
        update: {
          name: guild.name,
          ownerId: guild.ownerId ?? '',
          memberCount: guild.memberCount,
          status: 'active', // Reactivate the guild when it joins
          updatedAt: new Date(),
        },
        create: {
          id: guild.id, // Set 'id' when creating a new guild record
          name: guild.name,
          ownerId: guild.ownerId ?? '',
          memberCount: guild.memberCount,
          status: 'active',
          joinedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      console.log(
        `[DatabaseService] Guild ${guild.name} (${guild.id}) saved or updated.`,
      );
    } catch (error) {
      console.error(
        `[DatabaseService] Failed to save or update guild ${guild.name} (${guild.id}):`,
        error,
      );
    }
  }
}
