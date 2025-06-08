const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../util/validation");
const router = express.Router();

router.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req?.user;
    res.status(200).json({ data: user, message: "Data fetch successfully" });
  } catch (error) {
    res.status(400).send("Error : " + error?.message);
  }
});

router.patch("/profile/edit", userAuth, async (req, res) => {
  try {    
    if (!validateProfileEditData(req)) {
      throw new Error("Invalid Data Request");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });
    await loggedInUser.save();

    res.json({
      message: `${loggedInUser?.firstname}, your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("Error : " + error?.message);
  }
});

router.patch("/profile/updatePassword", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("Invalid Data Request");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });
    await loggedInUser.save();

    res.json({
      message: `${loggedInUser?.firstname}, your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("Error : " + error?.message);
  }
});

module.exports = router;
