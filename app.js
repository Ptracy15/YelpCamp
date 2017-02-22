var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    Campground     = require("./models/campground"),
    seedDB         = require("./seeds"),
    User           = require("./models/user"),
    Comment        = require("./models/comment");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Kristen is the best GF ever!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware function that will add user info to routes
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})

// =============================
// Routes for campgrounds
// =============================

app.get("/", function(req, res){
    res.render("landing");
});

// INDEX ROUTE - SHOW ALL CAMPGROUNDS
app.get("/campgrounds", function(req, res){
    // get all campgrounds from DB
    Campground.find({}, function(err, allcampgrounds){
        if(err){
            console.log(err)
        } else {
            res.render("campgrounds/index", {campgrounds: allcampgrounds, currentUser: req.user});
        }
    });
});

// CREATE ROUTE - ADD NEW CAMPGROUND TO DATA BASE
app.post("/campgrounds", function(req, res){
   //get data from form, and add to campground array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description
    var newCampground = {name: name, image: image, description: description};
    
    // create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else {
           // reidirect back to campgrounds page
           res.redirect("/campgrounds");
       }
    });
});

// SHOW FORM TO CREATE NEW CAMPGROUND
app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new")
});

// SHOWS - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err)
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});


// =============================
// Comments Routes
// =============================

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    // find campgruond by ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err)
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err)
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
    // create new comment
    // connect new comment to campground
    // redirect to back to show page of campground
})

// ================
// AUTH ROUTES
// ================

//show register / sign up form
app.get("/register", function(req, res){
    res.render("register");
});

// handle register / signup logic
app.post("/register", function(req, res){
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
app.get("/login", function(req, res){
    res.render("login");
});

// handle login post (using middleware)
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds", 
        failureRedirect: "/login"
    }), function(req, res){
});

//logout route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
})


// middleware logic for checking if the user is logged in
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return(next())
    }
    res.redirect("/login");
}

// =============================
// web application listening
// =============================
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server Started");
});