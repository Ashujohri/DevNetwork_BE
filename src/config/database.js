const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://NamasteDevNodeJS:sf0bajigZFYjgeHy@namastenode.joqzp.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
