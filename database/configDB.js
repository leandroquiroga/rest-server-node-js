const mongoose = require('mongoose');

const connectionDB = async() => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connection with database ${db.connection.name} success !`);
  } catch (err) {
    throw new Error('Ups! Has been a error')
  }
};

module.exports = {
  connectionDB,
}