const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");


require("dotenv").config();
// require('./util/cronJob');

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const initializeSocketServer = require("./util/socket");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);

const server = http.createServer(app);
initializeSocketServer(server)

connectDB()
  .then(() => {
    console.log("Database connect successfully");
    server.listen(process.env.PORT, () => {
      console.log(`Listening on port ${process.env.PORT}...`);
    });
  })
  .catch((error) => {
    console.error("Database can not be connected", error);
  });

// app.get("/feed", async (req, res) => {
//   try {
//     const users = await User.find({});
//     if (users.length === 0) {
//       res.send("No user found");
//     } else {
//       res.send(users);
//     }
//   } catch (error) {
//     res.status(400).send("Something went wrong");
//   }
// });

// app.delete("/deleteUser", async (req, res) => {
//   try {
//     const id = req.body._id;
//     const userDelete = await User.findByIdAndDelete(id);
//     if (userDelete.length === 0) {
//       res.send("No data found");
//     } else {
//       res.send("User deleted successfully");
//     }
//   } catch (error) {
//     res.status(400).send("Something went wrong");
//   }
// });

// app.patch("/userUpdate/:_id", async (req, res) => {
//   try {
//     const id = req?.params._id;
//     const data = req.body;

//     const ALLOWED_UPDATES = [
//       "photoUrl",
//       "about",
//       "gender",
//       "age",
//       "firstname",
//       "skills",
//       "lastname",
//     ];

//     const isUpdatedAllowed = Object.keys(data).every((key) =>
//       ALLOWED_UPDATES.includes(key)
//     );
//     if (!isUpdatedAllowed) {
//       throw new Error("Update now allowed");
//     }
//     const userUpdated = await User.findByIdAndUpdate(id, {
//       returnDocument: "after",
//       runValidators: true,
//     });
//     if (userUpdated.length === 0) {
//       res.send("No data found");
//     } else {
//       res.send("User updated successfully" + userUpdated);
//     }
//   } catch (error) {
//     res.status(400).send("Something went wrong");
//   }
// });
