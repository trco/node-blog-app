// Dependencies
var express = require('express')
var http = require('http')
var path = require('path')
var routes = require('./routes')
var index = require('./routes/index')
var user = require('./routes/user')
var article = require('./routes/article')

// Empty variables
var collections = {}

// Database setup
var MongoClient = require('mongodb').MongoClient
MongoClient.connect('mongodb://localhost:27017', function (error, client) {
  if (error)
    throw error
  var db = client.db('blog')
  collections = {
    articles: db.collection('articles'),
    users: db.collection('users')
  }
})

// Dependencies for middleware
var session = require('express-session')
var logger = require('morgan')
var errorHandler = require('errorhandler')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var methodOverride = require('method-override')

// Instantiate Express.js app
var app = express()
app.locals.appTitle = 'Node Blog App'

// App settings
app.set('port', process.env.PORT || 8000) // Define port on which the server listens to the requests
app.set('views', path.join(__dirname, 'views')) // Define templates folder
app.set('view engine', 'jade') // Define templates engine

// Middleware
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(methodOverride())
app.use(require('stylus').middleware(__dirname + '/public'))
app.use('/public', express.static('public')) // Set static files folder
// Add collections to each route by attaching them to the request
app.use(function (req, res, next) {
  if (!collections.articles || !collections.users) return next(new Error('No collection'))
  req.collections = collections
  next()
})

// Error handler
if ('development' == app.get('env')) {
  app.use(errorHandler())
}

// Routes
app.get('/', index.index)
app.get('/login', user.login)
app.post('/login', user.authenticate)
app.get('/logout', user.logout)
app.get('/admin', article.admin)
app.get('/post', article.post)
app.post('/post', article.postArticle)
app.get('/articles/:slug', article.show)
// API routes
app.get('/api/articles', article.list)
app.post('/api/articles', article.add)
app.put('/api/articles/:id', article.edit)
app.delete('/api/articles/:id', article.delete)

// 404 catch-all route catching all wrong urls
app.all('*', function(req, res) {
  res.sendStatus(404)
})

// Create server
var server = http.createServer(app)

var boot = function () {
  server.listen(app.get('port'), function() {
    console.log('Server listening on port http://127.0.0.1:' + app.get('port'))
  })
}

var shutdown = function () {
  server.close()
}

if (require.main === module) {
  boot()
}
else {
  console.info('Running app as a module')
  exports.boot = boot
  exports.shutdown = shutdown
  exports.port = app.get('port')
}
