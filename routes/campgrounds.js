var express  = require("express");
var router   = express.Router();
var Campground = require("../models/campground");

// campground page
router.get("/", function(req, res){
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
router.post("/", isLoggedIn, function(req, res){
   //get data from form, and add to campground array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: description, author: author};
    
    // create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else {
           // reidirect back to campgrounds page
           console.log(newlyCreated);
           res.redirect("/campgrounds");
       }
    });
});

// SHOW FORM TO CREATE NEW CAMPGROUND
router.get("/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// SHOWS - shows more info about one campground
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", checkCampgroundOwnership, function(req, res){
    // is user logged in
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", checkCampgroundOwnership, function(req, res){
   // find and update the correct campground
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
   // redirect back to show page
});

// DESTROY CAMPROUND ROUTE
router.delete("/:id", checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// =====================
// MIDDLEWARE FUNCTIONS
// =====================
// middleware logic for checking if the user is logged in
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return(next());
    }
    res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next){
        if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect("back");
            } else {
                // does user own campground?
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;
