var express = require('express');
var rest = require("./rest");

var API_URL_HOST = "api.foursquare.com";
var SELF_CHECKINS_PATH = '/v2/users/self/checkins';

var app = express();

// Returns the most recent checkin
app.get('/', function(req, res) {
  var path, options;

  path = SELF_CHECKINS_PATH + '?limit=1';
  path += '&oauth_token=' + process.env.FOURSQUARE_ACCESS_TOKEN;
  path += '&v=20130720';

  options = {
    host: API_URL_HOST,
    https: true,
    path: path,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  rest.getJSON(options,
    function(statusCode, result) {
      var checkin, responseObj;

      if (statusCode == 200) {
        checkin = result.response.checkins.items[0];
        responseObj = {
          name: checkin.venue.name,
          lat: checkin.venue.location.lat,
          lng: checkin.venue.location.lng,
          createdAt: checkin.createdAt
        };
        res.send(JSON.stringify(responseObj));
      } else {
        res.send({apiError: result});
      }
    }
  );
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
    console.log("Listening on " + port);
});
