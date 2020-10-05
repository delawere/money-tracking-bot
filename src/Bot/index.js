const telegraf = require('telegraf');
const handlers = require('../handlers');
const localSession = require('../localSession');

const { Telegraf } = telegraf;
const bot = new Telegraf(process.env.TOKEN);

const { middlewares, commandHandlers, onTextHandler } = handlers;

bot.use(localSession);
middlewares.forEach((middleware) => bot.use(middleware));
commandHandlers.forEach(({ command, handler }) => bot.command(command, handler));
bot.on('text', onTextHandler);

module.exports = bot;
