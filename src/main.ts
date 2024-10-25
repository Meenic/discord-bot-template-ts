import './config';
import { BaseClient } from './client';

(async () => {
  const client = new BaseClient();

  try {
    console.log(`[Main] Starting bot in ${process.env.NODE_ENV} mode...`);

    await client.startBot();
    await client.login(process.env.TOKEN);
  } catch (error) {
    console.error('[Main] Error during bot startup:', error);
    process.exit(1);
  }

  process.on('SIGINT', async () => {
    console.log('[Main] Shutting down...');
    await client.services.database.disconnect();
    process.exit(0);
  });
})();
