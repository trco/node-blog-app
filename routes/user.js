// User handlers

// GET users list
exports.list = function(req, res) {
  res.send('respond with a resource')
}

// GET login page
exports.login = function(req, res, next) {
  res.render('login')
  next()
}

// POST authenticate user
exports.authenticate = function(req, res, next) {
  res.redirect('/admin')
  next()
}

// GET logout route
exports.logout = function(req, res, next) {
  res.redirect('/')
  next()
}
