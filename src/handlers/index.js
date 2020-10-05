const { MenuTemplate, MenuMiddleware } = require('telegraf-inline-menu');
const User = require('../modules/User');
const Outcomes = require('../modules/Outcomes');
const UndefinedCategory = require('../utils/errors/UndefinedCategory');
const Category = require('../modules/Category');
const Budget = require('../modules/Budget');

let hideButtons = true;

const menuTemplate = new MenuTemplate(async ({ from }) => {
  const { first_name: firstName, last_name: lastName, username } = from;
  const user = await User.get(username);
  let reply = `Привет ${firstName} ${lastName}!`;

  if (!user) {
    reply = `Привет ${firstName} ${lastName}! Похоже ты здесь первый раз. Тебе нужно ответить на несколько вопросов. Начнем?`;
    hideButtons = false;
  }
  return reply;
});

const steps = {
  1: 'Сколько ты зарабатываешь в месяц?',
  2: 'Сколько тратишь каждый месяц?',
  3: 'А сколько откладываешь каждый месяц?',
};

const paramNameByStep = {
  1: 'monthlyBudget',
  2: 'monthlyOutcome',
  3: 'monthlySave',
};

menuTemplate.interact('Конечно', 'y', {
  hide: () => hideButtons,
  do: (ctx) => {
    ctx.session.initialize = true;
    ctx.session.step = 1;
    hideButtons = true;
    ctx.reply(steps[1]);

    return true;
  },
});

menuTemplate.interact('Неа', 'n', {
  hide: () => hideButtons,
  do: async (ctx) => {
    await ctx.answerCbQuery('you clicked me!');
    return false;
  },
});

const menuMiddleware = new MenuMiddleware('/', menuTemplate);

const budgetHandler = async () => {
  const res = await User.add({
    username: 'text',
    monthlyBudget: 0,
    name: 'test',
  });

  return res;
};

const catsHandler = async ({ reply }) => {
  const cats = await Category.getAll();
  reply(cats.map(({ name }) => name).join('\n'));
};

const middlewares = [
  menuMiddleware,
];

const commandHandlers = [
  {
    command: 'start',
    handler: (ctx) => menuMiddleware.replyToContext(ctx),
  },
  {
    command: 'budget',
    handler: budgetHandler,
  },
  {
    command: 'cats',
    handler: catsHandler,
  },
];

const onTextHandler = async (ctx) => {
  const {
    session,
    from: {
      username,
      first_name: firstName,
      last_name: lastName,
    },
    message: {
      text,
    },
    reply,
  } = ctx;

  if (session.initialize) {
    if (!session.userData) {
      session.userData = {};
    }
    session.userData.login = username;
    session.userData.name = `${firstName} ${lastName}`;

    const value = parseInt(text, 10);

    session.userData[paramNameByStep[session.step]] = value;

    const newStep = session.step + 1;
    session.step = newStep;

    if (!steps[newStep]) {
      await User.add(session.userData);
      session.initialize = false;
      reply('Отлично! Теперь можно пользоваться ботом для учета трат');
    } else {
      reply(steps[newStep]);
    }
  } else {
    const [category = 'other', value = 0] = text.split(' ');

    try {
      await Outcomes.add(username, { category, value });
      const saved = await Budget.getMoneyLeft(username);

      reply(`Осталось в этом месяце ${saved} рублей`);
    } catch (error) {
      if (error instanceof UndefinedCategory) {
        reply('Упс! Кажется такой категории нет!');
      } else {
        throw error;
      }
    }
  }
};

module.exports = {
  middlewares,
  commandHandlers,
  onTextHandler,
};
