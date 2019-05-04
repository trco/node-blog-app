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

// Set static files folder
app.use('/public', express.static('public'));

// Middleware


// Routes
app.all('*', function(req, res) {
  res.render('index', {appTitle: 'Node-Blog-App'});
});

// Create server
var server = http.createServer(app);

var boot = function () {
  server.listen(app.get('port'), function() {
    console.log('Server listening on port http://127.0.0.1:' + app.get('port'));
  });
};

var shutdown = function () {
  server.close();
};

if (require.main === module) {
  boot();
}
else {
  console.info('Running app as a module')
  exports.boot = boot;
  exports.shutdown = shutdown;
  exports.port = app.get('port');
}
