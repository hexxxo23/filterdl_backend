import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import db from "./config/Database.js";
import Users from "./models/userModels.js";
import router from "./routes/index.js";
dotenv.config();
const app = express();

const port = process.env.PORT || 5000;

try {
  await db.authenticate();
  console.log("Database Connected ..");
  // await Users.sync();
} catch (err) {
  console.error(err);
}

app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
