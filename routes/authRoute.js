const express = require("express");
const router = express.Router();
const passport = require("passport");
const controller = require("../controllers/authController");
const { userSchema } = require('../schemas');
const validate = require('../middleware/validate');

router.get("/signup", controller.renderSignup);
router.post("/signup", validate(userSchema), controller.signup);

router.get("/login", controller.renderLogin);

router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    (req, res) => {
        
        req.flash("success", "welcome back");
        
        if(req.user.role === "admin") {
            return res.redirect("/admin");
        }

        if(req.user.role === "seller") {
            return res.redirect("/seller/dashBoard");
        }

        if(req.user.role === "buyer") {
            return res.redirect("/batches");
        }

    }

);

router.get("/logout", controller.logout);

module.exports = router;