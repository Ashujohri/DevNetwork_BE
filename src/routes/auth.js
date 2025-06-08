const express = require("express");
const router = express.Router();
const { validateSignUpData } = require("../util/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstname, lastname, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: passwordHash,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res
      .status(200)
      .json({ message: "User Added successfully", data: savedUser });
  } catch (error) {
    res.send({ status: 400, message: error?.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
      });
      res.status(200).json({ message: "Login Successfull", data: user });
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: "Something went wrong", data: error?.message });
  }
});

router.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.status(200).json({ status: true, message: "Logout successfull" });
});

module.exports = router;
