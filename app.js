import express from "express";
import * as indexRouter from "./src/modules/index.router.js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import session from "express-session";
import mongooSession from "connect-mongodb-session";
import flash from "connect-flash";
import connectDB from "./DB/connectDB.js";
const __direName = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__direName, "./config/.env") });
const app = express();
const baseUrl = process.env.BASEURL;
const port = process.env.port;
app.use(express.json());
app.use(express.static(path.join(__direName, "./src/views/utils")));
app.use(express.urlencoded({ extended: true }));
const MongoDBStore = mongooSession(session);
const store = new MongoDBStore({
  uri: process.env.DBURI,
  collection: "mySessions",
});
app.use(
  session({
    secret: process.env.SESSIONSECRET,
    resave: false,
    store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 1, // 1 day
    },
    saveUninitialized: false,
  })
);
app.use(flash());
app.set("views", path.join(__direName, "./src/views"));
app.set("view engine", "ejs");
app.use(`${baseUrl}/auth`, indexRouter.authRouter);
app.use(`${baseUrl}/user`, indexRouter.userRouter);
app.use(`${baseUrl}/note`, indexRouter.postRouter);
app.use(`*`, (req, res) => {
  res.status(404).json({ message: "In-valid Routing" });
});
connectDB();
app.listen(port, () => {
  console.log(`Running..............${port}`);
});
