const dayjs = require('dayjs');
const Outcomes = require('../Outcomes');
const User = require('../User');

class Budget {
  static async getMoneyLeft(username) {
    const end = dayjs().format('YYYY-MM-DD');
    const begin = dayjs().startOf('month').format('YYYY-MM-DD');
    const outcomes = await Outcomes.getByFilterParams(username, { date: [begin, end] });
    const summ = outcomes.reduce((acc, { value: outcomeValue }) => acc + parseInt(outcomeValue, 10),
      0);
    const [user] = await User.get(username);
    const saved = user.monthlyBudget - summ;

    return saved;
  }
}

module.exports = Budget;
