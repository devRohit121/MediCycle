const User = require("../models/user");

exports.renderSignup = (req, res) => {
    res.render("users/signup.ejs");
};

exports.signup = async(req, res, next) => {
    try {
        let { email, username, password, role, organizationName, phone } = req.body;
        const newUser = new User({
            email,
            username,
            role,
            organizationName,
            phone
        });

        const registeredUser = await User.register(newUser, password);
        
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }

            req.flash("success", "Welcome to mediCycle");
            res.redirect("/batches");
        })

    } catch(err) {
        req.flash("error", err.message);
        console.log(err);
        res.redirect("/signup")
    }
};

exports.renderLogin = (req, res) => {
    res.render("users/login.ejs")
};

exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "logged out successfully");
        res.redirect("/login");
    })
};