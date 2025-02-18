require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const dbURI = require('./config')
const connectDB = require('./db/connect');
const storeLocals = require("./middleware/storeLocals");
const seesionRoutes = require("./routes/sessionRoutes");
const secretWordRouter = require("./routes/secretWord");

app.set("view engine", "ejs");
app.use(require("body-parser").urlencoded({ extended: true }));

app.use(express.json());

const session = require("express-session");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

const MongoDBStore = require("connect-mongodb-session")(session);
const url = dbURI;

const store = new MongoDBStore({
  uri: url,
  collection: "mySessions",
});
store.on("error", function (error) {
  console.log(error);
});

const sessionParms = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false, sameSite: "strict" },
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1);
  sessionParms.cookie.secure = true;
}

app.use(session(sessionParms));

app.use(require("connect-flash")());

app.use(storeLocals);
app.get("/", (req, res) => {
  res.render("index");
});
console.log(typeof seesionRoutes);

app.use("/sessions", seesionRoutes);

const passport = require("passport");
const passportInit = require("./passport/passportInit");

passportInit();
app.use(passport.initialize());
app.use(passport.session());

console.log(typeof secretWordRouter);
app.use("/secretWord", secretWordRouter);

app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});

app.use((err, req, res, next) => {
  res.status(500).send(err.message);
  console.log(err);
});

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(dbURI);
    app.listen(port, () => console.log(`Server is listening port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};


start();
