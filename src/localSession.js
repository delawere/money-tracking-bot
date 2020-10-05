const TelegrafSessionLocal = require('telegraf-session-local');

const localSession = new TelegrafSessionLocal({
  database: 'sessions.json',
});

module.exports = localSession.middleware();
