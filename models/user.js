const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const plm = require("passport-local-mongoose");
const passportLocalMongoose = plm.default || plm;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    username: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        enum: ['seller', 'buyer', 'admin'],
        default: "seller"
    },
    organizationName: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    }
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email"
});

const User = mongoose.model("User", userSchema);
module.exports = User;