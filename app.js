// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');

// Instantiate Express.js app
var app = express();

// App settings
app.set('port', process.env.PORT || 8000); // Define port on which the server listens to the requests
app.set('views', path.join(__dirname, 'views')); // Define templates folder
app.set('view engine', 'jade'); // Define templates engine

// Middleware


// Routes
app.all('*', function(req, res) {
  res.render('index', {msg: 'Welcome to the Node-Blog-App!'});
});

// Create server
http.createServer(app).listen(app.get('port'), function() {
  console.log('Server listening on port http://127.0.0.1:' + app.get('port'));
});
