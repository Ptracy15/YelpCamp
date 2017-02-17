var mongoose     = require("mongoose"),
    Campground   = require("./models/campground"),
    Comment      = require("./models/comment");
    

var data = [
        {
            name: "Clouds Rest", 
            image:"http://cdn-jpg2.theactivetimes.net/sites/default/files/camping.jpg",
            description: "Bacon ipsum dolor amet capicola prosciutto ball tip landjaeger. Meatloaf turducken boudin, andouille sirloin pancetta pork chop kevin bresaola biltong drumstick shankle corned beef short ribs beef. Shankle pastrami ball tip bresaola sausage, meatloaf tri-tip pork belly leberkas kielbasa filet mignon burgdoggen andouille pig. Salami meatball doner brisket short ribs jowl. Pig shoulder tongue tenderloin salami andouille turkey pork loin leberkas pork belly jerky capicola flank filet mignon. Venison leberkas drumstick bacon doner salami alcatra rump brisket biltong swine burgdoggen pancetta flank jowl. Porchetta venison biltong capicola."
        },
        {
            name: "Buzzard Belly Fields", 
            image:"https://farm9.staticflickr.com/8673/15989950903_8185ed97c3.jpg",
            description: "Bacon ipsum dolor amet capicola prosciutto ball tip landjaeger. Meatloaf turducken boudin, andouille sirloin pancetta pork chop kevin bresaola biltong drumstick shankle corned beef short ribs beef. Shankle pastrami ball tip bresaola sausage, meatloaf tri-tip pork belly leberkas kielbasa filet mignon burgdoggen andouille pig. Salami meatball doner brisket short ribs jowl. Pig shoulder tongue tenderloin salami andouille turkey pork loin leberkas pork belly jerky capicola flank filet mignon. Venison leberkas drumstick bacon doner salami alcatra rump brisket biltong swine burgdoggen pancetta flank jowl. Porchetta venison biltong capicola."
        },
        {
            name: "Outdoors In-Tents", 
            image:"https://farm7.staticflickr.com/6135/5952249358_72202c3d82.jpg",
            description: "Bacon ipsum dolor amet capicola prosciutto ball tip landjaeger. Meatloaf turducken boudin, andouille sirloin pancetta pork chop kevin bresaola biltong drumstick shankle corned beef short ribs beef. Shankle pastrami ball tip bresaola sausage, meatloaf tri-tip pork belly leberkas kielbasa filet mignon burgdoggen andouille pig. Salami meatball doner brisket short ribs jowl. Pig shoulder tongue tenderloin salami andouille turkey pork loin leberkas pork belly jerky capicola flank filet mignon. Venison leberkas drumstick bacon doner salami alcatra rump brisket biltong swine burgdoggen pancetta flank jowl. Porchetta venison biltong capicola."
        }
    ]

function seedDB(){
    
    // remove campground from DB
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campground");
        
        // add a few campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err);
                } else {
                    console.log("added a campground");
                    // create comment
                    Comment.create({
                        text: "this place is great, but i wish there was internet",
                        author: "Homer"
                    }, function(err, comment){
                        if(err){
                            console.log(err)
                        } else {
                            campground.comments.push(comment);
                            campground.save();
                            console.log("created new comment")
                        }
                    });
                }
            });
        });
    });
}
module.exports = seedDB;
