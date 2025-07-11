const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(process.env.DB_CONNECTION_SECRET_KEY);
};

module.exports = connectDB;
