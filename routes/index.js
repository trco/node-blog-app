// Index handlers

exports.index = function(req, res, next) {
  // Get articles & show them on homepage
  req.collections.articles.find({}).toArray(function(error, articles) {
    if (error)
      return next(error)
    // render(template, context)
    res.render('index', {articles: articles})
  })
}
