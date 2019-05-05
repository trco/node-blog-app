// Dependencies
var express = require('express')
var http = require('http')
var path = require('path')
var routes = require('./routes')

// Database setup
var mongoskin = require('mongoskin')
var dbUrl = process.env.MONGOHQ_URL || 'mongodb://@localhost:27017/blog'
var db = mongoskin.db(dbUrl, {safe: true})
var collections = {
  articles: db.collection('articles'),
  users: db.collection('users')
}

// Dependencies for middleware
var session = require('express-session')
var logger = require('morgan')
var errorHandler = require('errorHandler')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var methodOverride = require('method-override')

// Instantiate Express.js app
var app = express()
app.locals.appTitle = 'Node Blog App'

// Add collections to each route by attaching them to the request
app.use(function (req, res, next) {
  if (!collections.articles || !collections.users) return next(new Error('No collection'))
  req.collections = collections
  return next()
})

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
// app.use('/public', express.static('public')) // Set static files folder
app.use(express.static(path.join(__dirname, 'public'))) // Set static files folder

// Error handler
if ('development' == app.get('env')) {
  app.use(errorHandler())
}

// Routes
app.get('/', routes.index)
app.get('/login', routes.user.login)
app.post('/login', routes.user.authenticate)
app.get('/logout', routes.user.logout)
app.get('/admin', routes.article.admin)
app.get('/post', routes.article.post)
app.post('/post', routes.article.postArticle)
app.get('/articles/:slug', routes.article.show)
// API routes
app.get('/api/articles', routes.article.list)
app.post('/api/articles', routes.article.add)
add.put('/api/articles/:id', routes.article.edit)
add.del('/api/articles/:id', routes.article.delete)

// 404 catch-all route catching all wrong urls
app.all('*', function(req, res) {
  res.send(404)
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
