require("dotenv").config();

var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require("request");
var fs = require('fs');

var liriAction = "";
var thisInfo = "";

//console.log(liriAction + ", " + thisInfo);
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

//do-what-it-says
if (process.argv[2] === "do-what-it-says") {
    fs.readFile('./random.txt', "utf8", function (err, data) {
        if (err) throw err;
        //console.log(data);
        var array = data.split(",");
        // console.log(array);
        liriAction = array[0];
        thisInfo = array[1];
        console.log(liriAction);
        console.log(thisInfo);
        fs.appendFile("./log.txt", process.argv[2] + " led to: ", "utf8", function(ohoh, data){
            if(ohoh) {
                console.log(ohoh);
            }
        });
        goGoLiriGo(liriAction, thisInfo);
    });
} else {
    liriAction = process.argv[2];
    //above line determine what action is being requested.
    thisInfo = process.argv.slice(3).join(" ");
    //above line puts the 4th - last parts of the array and joins them into a string
    goGoLiriGo(liriAction, thisInfo);
}

function goGoLiriGo(liriAction, thisInfo) {
    //write to the file log.txt
    fs.appendFile("./log.txt", liriAction + ", " + thisInfo + "\n", "utf8", function(ohoh, data){
        if(ohoh) {
            console.log(ohoh);
        }
    });

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
                    console.log("Tweet #" + (i + 1) + ": " + tweets[i].text + "\n      Tweeted on " + tweets[i].created_at);
                }
            }
        });
    }
    //omdb
    else if (liriAction === "movie-this") {
        if (thisInfo === "") {
            thisInfo = "Silent Movie";
        }

        var queryUrl = "http://www.omdbapi.com/?t=" + thisInfo + "&y=&plot=short&apikey=trilogy";
        request(queryUrl, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                movie = JSON.parse(body);
                console.log(movie.Title);
                console.log("Released in " + movie.Year);
                if (movie.Ratings[0] !== undefined) {
                    console.log("IMDB rating: " + movie.Ratings[0].Value);
                }
                if (movie.Ratings[1] !== undefined) {
                    console.log("Rotten Tomato rating: " + movie.Ratings[1].Value);
                }
                //had to create these two if statements because I came across a movie that did not have a Rotten Tomato rating.  The movie was Ants (did not return the Dreamworks movie but some straight to video movie instead).
                console.log("Filmed in: " + movie.Country);
                console.log("Language: " + movie.Language);
                console.log("Plot: " + movie.Plot);
                console.log("Actors: " + movie.Actors);
            }
        });

    }

    else if (liriAction === "give-Chay-an-A-plus") {
        console.log("I certainly agree with you. \nHowever, I do not have access to the grade book. \nI will log your request though.")
    }
    else {
        if(liriAction !== "help") {
            console.log("Not a valid command.  Try one of the following");
        }
        console.log("do-what-it-says  ---  do whatever action is in the random.txt file");
        console.log("movie-this [movie title]  ---  pull up information on a movie");
        console.log("my-tweets   ---   to read the first and last 20 tweets I will ever do");
        console.log("spotify-this-song [song title]  ---  to get information about a song");
        console.log("While I am more user friendly than Siri, I refuse to correct your spelling.  Please make sure you know how to spell whatever you are looking for; this includes using proper spaces.  Thank you.");
    }
}

/*
Pseudocode:
Set up all the basic variable/calls needed for each of the liri actions
Create a series of if /else-ifs that will check that process.argv[3] is "twitter" then it will pull up the twitter stuff and so on.
Do same for all the other parts of liri.
See if it can be simplified by making everything into one object that then pushes different variables through a function.  Why?  Because simplified code is pretty, damn it!  Based on what I wrote, an object would only make it slightly cleaner/simplified.  When considering the time needed to simplify, it seems keeping it a little ugly is better.  After all, everything in life is a little ugly, why should Liri be any different?
Once this is successful, see if I can get each part to also print a line into a log of what liri is doing.  Or better yet, get Liri to do this before each part and then I only need to do it once.  Ahh, simplified.
*/