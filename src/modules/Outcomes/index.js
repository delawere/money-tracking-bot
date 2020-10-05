const dayjs = require('dayjs');
const User = require('../User');
const db = require('../../connection');
const Category = require('../Category');
const UndefinedCategory = require('../../utils/errors/UndefinedCategory');

class Outcomes {
  static async checkCategory(category) {
    const categories = await Category.getAll();
    const finded = categories.find(({ name }) => name.toLowerCase() === category.toLowerCase());

    if (finded) {
      return finded.key;
    }
    throw new UndefinedCategory('Undefined category name');
  }

  static async add(username, { category, value }) {
    const categoryKey = await Outcomes.checkCategory(category);
    const users = await User.get(username);
    const userId = users[0].id;
    const user = db.collection('users').doc(userId).collection('outcomes');

    return user.add({
      category: categoryKey,
      value,
      date: new Date(),
    });
  }

  static async getByFilterParams(username, { category = 'all', date = null }) {
    let period = [];
    if (!Array.isArray(date) || date.length === 1) {
      period = [date, date];
    } else {
      period = date;
    }
    const [begin, end] = period;
    const result = [];
    const users = await User.get(username);
    const userId = users[0].id;
    const outcomes = db.collection('users').doc(userId).collection('outcomes');
    const snapshot = await outcomes
      .where('date', '>', new Date(`${begin}T00:00:00.908Z`))
      .where('date', '<', new Date(`${end}T23:59:59.908Z`))
    //   .where('category', '==', category)
      .get();

    if (snapshot.empty) {
      console.log('No matching documents.');
      return null;
    }

    snapshot.forEach((doc) => {
      const { date: rowDate, category: rowCategory, value } = doc.data();
      result.push({
        category: rowCategory,
        value,
        date: dayjs(rowDate.toDate()).format('DD.MM.YYYY'),
      });
    });

    return result;
  }
}

module.exports = Outcomes;
