const express = require('express')
const BookmarksService = require('./bookmarks-service')
const bookmarksRouter = express.Router()
const jsonParser = express.json()


const serializeArticle = article => ({
  id: article.id,
  url: xss(article.url),
  discription: xss(discription),
  rating: article.rating,

})

bookmarksRouter
  .route('/bookmarks')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    BookmarksService.getAllBookmarks(knexInstance)
        .then(Bookmarks => {
            res.json(Bookmarks)
        })
        .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { url, discription, rating } = req.body
    const newArticle = { title, content, style }

    for (const [key, value] of Object.entries(newArticle))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    ArticlesService.insertArticle(
      req.app.get('db'),
      newArticle
    )
      .then(article => {
        res
          .status(201)
          .location(`/articles/${article.id}`)
          .json(serializeArticle(article))
      })
      .catch(next)
  })
bookmarksRouter
  .route('/bookmarks/:id')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    BookmarksService.getById(knexInstance, req.params.id)
      .then(book => {
          if (!book) {
              return res.status(404).json({
                  error: { message: `Bookmark doesn't exist` }
              })
          }
          res.json(book)
      })
      .catch(next)
  })

module.exports = bookmarksRouter