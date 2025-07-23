const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      maxLength: 15,
      minLength: 2,
    },
    lastname: {
      type: String,
      required: false,
      maxLength: 15,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      validate(value) {
        if (!validator?.isEmail(value)) {
          throw new Error("Invalid Email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Please enter valid input");
        }
      },
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    membershipType: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },
    membershipTypeDuration: {
      type: Number,
      default: 0,
    },
    photoUrl: {
      type: String,
    },
    about: {
      type: String,
      default: "Tell us about your self",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

userSchema.index({ firstname: 1, lastname: 1 });

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = jwt.sign({ _id: user?._id }, "JOHAri@1993", {
    expiresIn: "2h",
  });

  return token;
};

userSchema.methods.validatePassword = async function (password) {
  const user = this;
  const isPasswordValid = await bcrypt.compare(password, user?.password);

  return isPasswordValid;
};

const user = new mongoose.model("User", userSchema);
module.exports = user;
