const { Router } = require("express");
const authController = require("../controllers/authController");
const multer = require("multer");
const path = require("path");
const serviceProvider = require("../schema/serviceProvider");
const User = require('../schema/User');
const { requireAuth, checkUser } = require("../middleware/authMiddleware");


const storage = multer.diskStorage({
  destination: path.normalize(path.join(__dirname, "..", "public", "uploads")),
  filename: (req, file, callback) => {
    callback(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit (adjust as needed)
  },
});

const router = Router();

router.get("/signup", authController.signup_get);
router.post("/signup", authController.signup_post);
router.get("/login", authController.login_get);
router.post("/login", authController.login_post);
router.get("/createServiceProvider", authController.createServiceProvider_get);
router.post("/createServiceProvider",upload.fields([{ name: "profilePicture" }, { name: "certificate" }]),authController.createServiceProvider_post);
router.get("/view_profile/:id", authController.view_profile_get);
router.get("/contact", authController.contact_get);
router.post("/contact", authController.contact_post);
router.get("/logout", authController.logout_get);
router.get("/successfullyCreated", async (req, res) => {
  res.write("Your Account is created Successfully");
});


module.exports = router;
