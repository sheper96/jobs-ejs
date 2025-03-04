require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const dbURI = require('./config')
const dbURITest = require('./config')
const connectDB = require('./db/connect');
const storeLocals = require("./middleware/storeLocals");
const seesionRoutes = require("./routes/sessionRoutes");
const secretWordRouter = require("./routes/secretWord");
const jobsRouter = require("./routes/jobsRotes");
const csrf = require('host-csrf')

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

// if (app.get("env") === "production") {
//   app.set("trust proxy", 1);
//   sessionParms.cookie.secure = true;
// }



app.use(session(sessionParms));

app.use(require("connect-flash")());

app.use(require("./middleware/storeLocals"));



app.get("/", (req, res) => {
  res.render("index");
});
app.use("/sessions", require("./routes/sessionRoutes"));



// let csrf_development_mode = true;
// if (app.get("env") === "production") {
//   csrf_development_mode = false;
//   app.set("trust proxy", 1);
// }
// const csrf_options = {
//   protected_operations: ["PATCH"],
//   protected_content_types: ["application/json"],
//   development_mode: csrf_development_mode,
// };
// const csrf_middleware = csrf(csrf_options);

//app.use("/sessions", csrf_middleware, seesionRoutes);

const passport = require("passport");
const passportInit = require("./passport/passportInit");

passportInit();
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.errors = req.flash("error");
  res.locals.messages = req.flash("success");
  next();
});



console.log(typeof secretWordRouter);
const auth = require("./middleware/auth");

app.use((req, res, next) => {
  if (req.path == "/multiply") {
    res.set("Content-Type", "application/json");
  } else {
    res.set("Content-Type", "text/html");
  }
  next();
});

app.use("/secretWord", auth, secretWordRouter);
app.use("/jobs", jobsRouter);

app.get("/multiply", (req, res) => {
  const result = req.query.first * req.query.second;
  if (result.isNaN) {
    result = "NaN";
  } else if (result == null) {
    result = "null";
  }
  res.json({ result: result });
});


app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});

// app.use((err, req, res, next) => {
//   res.status(500).send(err.message);
//   console.log(err);
// });

const port = process.env.PORT || 3000;

let mongoURL = dbURI;
if (process.env.NODE_ENV == "test") {
  mongoURL = dbURITest;
}

const start = async () => {
  try {
    await connectDB(mongoURL);
    app.listen(port, () => console.log(`Server is listening port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};


start();
