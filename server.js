const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");
const dbConnection = require("./db/dbConnection");


const port = process.env.PORT;

// set views
app.set("views", "./views");
app.set("view engine", "ejs");

// middle-ware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use(authRoutes);
app.use(cookieParser());

app.get("*", checkUser);

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/user", requireAuth, (req, res) => res.render("user"));

app.get("/services", requireAuth, (req, res) => res.render("services"));

app.listen(port, () => {
  console.log(`successfully running on PORT ${port}`);
});
