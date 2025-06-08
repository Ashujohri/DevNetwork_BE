const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://NamasteDevNodeJS:AmhmbhVuYAGMGX3P@namastenode.joqzp.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
