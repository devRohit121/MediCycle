const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.ATLASDB_URL);

    const exists = await User.findOne({ role: "admin" });
    if (exists) {
      console.log("Admin already exists");
      process.exit();
    }

    const admin = new User({
      email: "rohit@gmail.com",
      organizationName: "System Admin",
      phone: "8840041207",
      role: "admin"
    });

    await User.register(admin, "rohit@121");

    console.log("Admin created successfully");
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

seedAdmin();