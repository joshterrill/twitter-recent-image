var express = require("express");
var morgan = require("morgan");
var fs = require("fs");
var request = require("request");

var app = express();
app.use(morgan("tiny"));

var Twitter = require("twitter");
var client = new Twitter({
  consumer_key: "",
  consumer_secret: "",
  access_token_key: "",
  access_token_secret: ""
});

var screen_name = "joshterrill"

var params = {screen_name: screen_name, 
              include_entities: true, 
              exclude_replies: true, 
              contributor_details: false, 
              include_rts: false};

app.get("/", function(req, res) {
  client.get("statuses/user_timeline", params, function(error, tweets, response){
    if (!error) {
      for (var i = 0; tweets.length; i++) {
        if (tweets[i].entities.media) {
          request.get(tweets[i].entities.media[0].media_url).pipe(res);
          return;
        }
      }
    } else {
      res.json({error: error})
    }
  });
});

var port = process.env.PORT || 3000;
app.listen(port);