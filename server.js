const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");
const dbConnection = require("./db/dbConnection");
const User = require("./schema/User")
const serviceProvider = require("./schema/serviceProvider")

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

app.get("/user", requireAuth, async (req, res) => {
  try {
    const allServiceProviders = await serviceProvider.find();

    res.render('user', { allServiceProviders});
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
});


app.get("/services", requireAuth, (req, res) => res.render("services"));

app.get("/allServiceProviders", requireAuth, async (req, res) => {
  try {
    const allServiceProviders = await serviceProvider.find();

    res.render('allServiceProviders', { allServiceProviders});
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/getServiceProvidersByServiceAndLocation", async (req, res) => {
  const { service, location } = req.query;

  // Check if both service and location parameters are provided
  if (service && location) {
    try {
      // Perform the MongoDB query with $regex for location
      const serviceProviders = await serviceProvider.find({
        $and: [
          { service: service }, // Match exact service name
          { location: { $regex: location, $options: "i" } }, // Case-insensitive location search
        ],
      });

      res.json(serviceProviders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error finding service providers" });
    }
  } else  if (location) {
    // If only location is provided
    try {
      const serviceProviders = await serviceProvider.find({
        location: { $regex: location, $options: "i" }, // Case-insensitive location search
      });
      res.json(serviceProviders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error finding service providers" });
    }
  } else if (service) {
    // If only service is provided
    try {
      const serviceProviders = await serviceProvider.find({ service: service });
      res.json(serviceProviders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error finding service providers" });
    }
  }  else {
    // Return an error response if neither service nor location is provided
    res.status(400).json({ message: "Invalid parameters" });
  }
});


app.get("/getStarted", requireAuth, (req, res) => res.render("getStarted"));

app.get("/getStartedAsAServiceProvider", requireAuth, (req, res) => res.render("getStartedAsAServiceProvider"));

app.get("/successfullyCreatedAnAccount", requireAuth, (req, res) => res.render("successfullyCreatedAnAccount"));

app.get("/successfullyCreatedYourServiceProviderProfile", requireAuth, (req, res) => res.render("successfullyCreatedYourServiceProviderProfile"));

app.get("/findServiceProvider", requireAuth, async (req, res) => {
  try {
    const serviceProviders = await serviceProvider.find();

    res.render('findServiceProvider', { serviceProviders });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/viewServiceProviderDetails/:id", requireAuth, async (req, res) => {
  try {
    const serviceProviders = await serviceProvider.findById(req.params.id);
    if (!serviceProviders) {
      return res.status(404).json({ message: "can't find service provider details" });
    }

    res.render('viewServiceProviderDetails', { serviceProviders });
  } catch (error) {
    res.status(500).json({ message: 'There was an error while retrieving service provider profile' });
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`successfully running on PORT ${port}`);
});
