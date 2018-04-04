require("dotenv").config();

var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require("request");

var liriAction = process.argv[2];
//above line determine what action is being requested.

var thisInfo = process.argv.slice(3).join(" ");

console.log(liriAction + ", " + thisInfo);
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

//spotify
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
//twitter
else if (liriAction === "my-tweets") {
    var params = { screen_name: 'notchayeither' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (i = 0; i < tweets.length; i++) {
                console.log("Tweet #" + (i+1) + ": " + tweets[i].text);
            }
        }
    });
}
//omdb
else if (liriAction === "movie-this") {
    if (thisInfo === "") {
        thisInfo = "Harry and the Hendersons";
    }
    
    var queryUrl = "http://www.omdbapi.com/?t=" + thisInfo + "&y=&plot=short&apikey=trilogy";
    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            movie = JSON.parse(body);
          console.log(movie.Title);
          console.log("Released in " + movie.Year);
          console.log("IMDB rating: " + movie.Ratings[0].Value);
          console.log("Rotten Tomato rating: " + movie.Ratings[1].Value);
          console.log("Filmed in: " + movie.Country);
          console.log("Language: " + movie.Language);
          console.log("Plot: " + movie.Plot);
          console.log("Actors: " + movie.Actors);
        }
      });

}

/*
Pseudocode:
Set up all the basic variable/calls needed for each of the liri actions
Create a series of if /else-ifs that will check that process.argv[3] is "twitter" then it will pull up the twitter stuff and so on.
Do same for all the other parts of liri.
See if it can be simplified by making everything into one object that then pushes different variables through a function.  Why?  Because simplified code is pretty, damn it!
Once this is successful, see if I can get each part to also print a line into a log of what liri is doing.  Or better yet, get Liri to do this before each part and then I only need to do it once.  Ahh, simplified.
*/