const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
const router = express.Router();

router.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      return res
        .status(400)
        .json({ message: "Invalid status type: " + status });
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const connectionRequest = new ConnectionRequestModel({
      fromUserId,
      toUserId,
      status,
    });
    const data = await connectionRequest.save();
    res.json({ message: "Connection Request Sent Successfully", data });
  } catch (error) {
    res.status(400).send("Error: " + error?.message);
  }
});

router.post("/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req?.user;
    const { status, requestId } = req.params;

    const allowedStatus = ["accepeted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const connectionRequest = await ConnectionRequestModel.findOne({
      _id: requestId,
      toUserId: loggedInUser?._id,
      status: "interested",
    });

    if (!connectionRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();

    res.json({ mesage: "Connection request " + status, data });
  } catch (error) {
    res.status(400).json({ message: `Error:  + ${error?.message}` });
  }
});

module.exports = router;
