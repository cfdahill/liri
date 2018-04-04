require("dotenv").config();

var Spotify = require('node-spotify-api');
var request = require("request");

var liriAction = process.argv[2];
//above line determine what action is being requested.

var thisInfo = process.argv.slice(3).join(" ");

//console.log(liriAction + ", " + thisInfo);
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
//var client = new Twitter(keys.twitter);


if (liriAction === "spotify-this-song") {
    if (thisInfo === "") {
        thisInfo = "jungleland";
    }

    spotify.search({ type: 'track', query: thisInfo, limit: 1 }, function (oops, data) {
        if (oops) {
            return console.log("That was a bad note: " + oops);
        }
        else {
            console.log("Musician: " + JSON.stringify(data.tracks.items[0].artists[0].name));
            console.log("Song: " + JSON.stringify(data.tracks.items[0].name));
            console.log("Link: " + JSON.stringify(data.tracks.items[0].preview_url));
            console.log("Album: " + JSON.stringify(data.tracks.items[0].album.name));
            return;
        }
    });
}
else if (liriAction === "my-tweets") {
//set up the new twitter, should still be logged in.  It is using the new gmail account: chayuabootcamp, maybe chayuacodecamp, I can't remember.  The twitter name is notchayeither
}

/*
Pseudocode:
Set up all the basic variable/calls needed for each of the liri actions
Create a series of if /else-ifs that will check that process.argv[3] is "twitter" then it will pull up the twitter stuff and so on.
Do same for all the other parts of liri.
See if it can be simplified by making everything into one object that then pushes different variables through a function.  Why?  Because simplified code is pretty, damn it!
Once this is successful, see if I can get each part to also print a line into a log of what liri is doing.  Or better yet, get Liri to do this before each part and then I only need to do it once.  Ahh, simplified.
*/