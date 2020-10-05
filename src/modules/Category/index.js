const db = require('../../connection');

class Category {
  static async parseSnapshot(snapshot) {
    const result = [];
    snapshot.forEach((doc) => {
      const { key, name } = doc.data();

      result.push({
        id: doc.id,
        key,
        name,
      });
    });

    return result;
  }

  static async getAll() {
    const catRef = db.collection('categories');
    const snapshot = await catRef.get();

    if (snapshot.empty) {
      throw new Error('No matching documents');
    }

    return Category.parseSnapshot(snapshot);
  }

  static async get(key) {
    const catRef = db.collection('categories');
    const snapshot = await catRef.where('key', '==', key).get();

    if (snapshot.empty) {
      return null;
    }

    return Category.parseSnapshot(snapshot);
  }

  static async add(data) {
    const catRef = db.collection('categories');
    const { id } = await catRef.add(data);

    return id;
  }
}

module.exports = Category;
