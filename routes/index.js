var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// landing route
router.get("/", function(req, res){
    res.render("landing");
});


//show register / sign up form
router.get("/register", function(req, res){
    res.render("register");
});

// handle register / signup logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

// show login form
router.get("/login", function(req, res){
    res.render("login");
});

// handle login post (using middleware)
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds", 
        failureRedirect: "/login"
    }), function(req, res){
});

//logout route
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});

// middleware logic for checking if the user is logged in
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return(next())
    }
    res.redirect("/login");
}


module.exports = router;
