const db = require('../../connection');

class User {
  static async parseSnapshot(snapshot) {
    const result = [];
    snapshot.forEach((doc) => {
      const { name, monthlyBudget, login } = doc.data();

      result.push({
        id: doc.id,
        name,
        monthlyBudget,
        login,
      });
    });

    return result;
  }

  static async getAll() {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();

    if (snapshot.empty) {
      throw new Error('No matching documents');
    }

    return User.parseSnapshot(snapshot);
  }

  static async get(username) {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('login', '==', username).get();

    if (snapshot.empty) {
      return null;
    }

    return User.parseSnapshot(snapshot);
  }

  static async add(data) {
    const usersRef = db.collection('users');
    const { id } = await usersRef.add(data);

    return id;

    // return key;
  }

  //   delete() {

//   }
}

module.exports = User;
