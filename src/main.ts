import './config';
import { CustomClient } from './client';

(async () => {
  const bot = new CustomClient();

  try {
    console.log(`[Main] Starting bot in ${process.env.NODE_ENV} mode...`);

    await bot.startBot();
    await bot.login(process.env.TOKEN);
  } catch (error) {
    console.error(`[Main] Error during bot startup:`, error);
    process.exit(1);
  }
})();
