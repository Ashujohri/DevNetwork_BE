const cron = require("node-cron");
const ConnectionRequestModel = require("../models/connectionRequest");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("./sendEmail");

cron.schedule("* * * * *", async () => {
  // Send emails to all people who got request previous day
  try {
    const yesterdayDate = subDays(new Date(), 1);
    const yesterdayStart = startOfDay(yesterdayDate);
    const yesterdatEnd = endOfDay(yesterdayDate);

    const pendingRequest = await ConnectionRequestModel.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdatEnd,
      },
    }).populate("fromUserId toUserId");

    const listOfEmails = [
      ...new Set(pendingRequest.map((req) => req.toUserId.email)),
    ];
    for (const emails of listOfEmails) {
      // Send Emails
      try {
        const response = await sendEmail.run(
          "New Friend Request Pending " + emails,
          "There are so many friend request pending, Please login to CorporateTinder.in"
        );
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    }
  } catch (error) {
    console.error(error);
  }
});
