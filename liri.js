var keys = require("./keys");
var request = require("request");
var Twitter = require("twitter");
var spotify = require('spotify');
var fs = require("fs");

var command = process.argv[2];

if (command === "my-tweets"){
	var client = new Twitter({
	  consumer_key: keys.twitterKeys.consumer_key,
	  consumer_secret: keys.twitterKeys.consumer_secret,
	  access_token_key: keys.twitterKeys.access_token_key,
	  access_token_secret: keys.twitterKeys.access_token_secret
	});

	var params = {screen_name: 'niesharobinson'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {

	  	for (i=0; i<20; i++){
	  		console.log(tweets[i].text + "\n" + tweets[i].created_at);
	  	}
	    
	  } else {
			console.log("No response");
		}
	});

}

if (command === "spotify-this-song"){
	
	if (process.argv.length === 3){
		spotify.lookup({ type: 'track', id: "0hrBpAOgrt8RXigk83LLNE" }, function(err, data) {
	    		console.log(data.artists[0].name + "\n" + data.name + "\n" + data.preview_url + "\n" + data.album.name);
	    	});
	} else {
		var querySong = process.argv[3];
		spotifySong(querySong);
	}
}

function spotifySong(querySong){
	spotify.search({ type: 'track', query: querySong }, function(err, data) {
		    if ( err ) {
		        console.log('Error occurred: ' + err);
		        return;
		    }
		    console.log(data.tracks.items[0].artists[0].name + "\n" + data.tracks.items[0].name + "\n" + data.tracks.items[0].preview_url + "\n" + data.tracks.items[0].album.name);
		});
}


if (command === "movie-this"){
	var movieName = process.argv[3];
	if (process.argv.length === 3){
		request("http://www.omdbapi.com/?t=Mr.+Nobody&y=&plot=short&r=json", function(error, response, body){
			if (!error && response.statusCode === 200){
				logMovie (body);
			} else {
				console.log("No response");
			}
		});
	} else {
		request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&r=json", function(error, response, body){
			if (!error && response.statusCode === 200){
				logMovie (body);
			} else {
				console.log("No response");
			}
		});
	}
}

function logMovie (body){
	console.log(
		JSON.parse(body).Title + "\n" +
		JSON.parse(body).Year + "\n" +
		JSON.parse(body).imdbRating+ "\n" +
		JSON.parse(body).Country + "\n" +
		JSON.parse(body).Language + "\n" +
		JSON.parse(body).Plot + "\n" +
		JSON.parse(body).Actors + "\n" +
		JSON.parse(body).Ratings[0].Source[1] + "\n" +
		JSON.parse(body).Website
	);
}

if (command === "do-what-it-says"){
	fs.readFile("random.txt", "utf8", function(error,data){
		var dataArr = data.split(",");
		if (dataArr[0]==="spotify-this-song"){
			spotifySong(dataArr[1]);
		}
		

	});
}