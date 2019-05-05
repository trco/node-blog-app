// Article handlers

// GET admin page
exports.admin = function(req, res, next) {
  req.collections.articles.find({}, {sort: {_id:-1}}).toArray(function(error, articles) {
    if (error)
      return next(error)
    // render(template, context)
    res.render('admin', {articles: articles})
  })
}

// GET article form page
exports.post = function(req, res, next) {
  if (!req.body.title)
  res.render('post')
}

// POST article form
exports.postArticle = function(req, res, next) {
  if (!req.body.title || !req.body.slug || !req.body.text ) {
    return res.render('post', {error: 'Fill title, slug and text.'});
  }
  // Get article values from request's body
  var article = {
    title: req.body.title,
    slug: req.body.slug,
    text: req.body.text,
    publish: false,
  }
  // Insert article into the database
  req.collections.articles.insert(article, function(error, articleResponse) {
    if (error)
      return next(error)
    res.render('post', {error: 'Article was added, Publish it on Admin page.'})
  })
}

// GET article page
exports.show = function(req, res, next) {
  if (!req.params.slug)
    return next(new Error('No article slug.'))
  // Get article from database based on slug
  req.collections.articles.findOne({slug: req.params.slug}, function(error, article) {
    if (error)
      return next(error)
    if (!article.published)
      return res.send(401)
    res.render('article', {article: article})
  })
}

// API handlers
// GET articles list
exports.list = function(req, res, next) {
  // Get articles & convert mongoskin cursor to array
  req.collections.articles.find().toArray(function(error, articles) {
    if (error)
      return next(error)
    res.send({articles: articles})
  })
}

// POST add article
exports.add = function(req, res, next) {
  if (!req.body.article)
    return next(new Error('No article payload.'))
  // Get article from request's body
  var article = req.body.article
  article.published = false
  // Insert article into the database
  req.collections.articles.insert(article, function(error, articleResponse) {
    if (error)
      return next(error)
    res.send(articleResponse)
  })
}

// PUT update article
exports.edit = function(req, res, next) {
  if (!req.params.id)
    return next(new Error('No article ID.'))
  // Get updated article values from request's body
  var article = req.body.article
  // Update article based on id in url
  req.collections.articles.updateById(req.params.id, {$set: article},
    function(error, count) {
      if (error)
        return next(error)
      res.send({affectedCount: count})
    })
}

// DEL delete article
exports.delete = function(req, res, next) {
  if (!req.params.id)
    return next(new Error('No article ID.'))
  // Delete article based on id in url
  req.collections.articles.removeById(req.params.id, function(error, count) {
    if (error)
      return next(error)
    res.send({affectedCount: count})
  })
}
