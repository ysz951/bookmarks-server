const express = require('express')
const BookmarksService = require('./bookmarks-service')
const bookmarksRouter = express.Router()
const jsonParser = express.json()
const xss = require('xss')
const validUrl = require('valid-url')

const serializeArticle = article => ({
  id: article.id,
  title: xss(article.title),
  url: xss(article.url),
  description: xss(article.description),
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
    const { title, url, description = "", rating } = req.body
    const newArticle = { title, url, description, rating }

    for (const [key, value] of Object.entries(newArticle))
      if (!value)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    if (!validUrl.isWebUri(url)) {
      return res
        .status(400)
        .send(`'url' should be a valid URL`)
    }
    if (!Number.isInteger(rating) || rating <= 0 || rating > 5){
      return res
        .status(400)
        .send(`'rating' should be an integer between 1 and 5`)
    }

    BookmarksService.insertBookmark(
      req.app.get('db'),
      newArticle
    )
      .then(article => {
        res
          .status(201)
          .location(`/bookmarks/${article.id}`)
          .json(serializeArticle(article))
      })
      .catch(next)
  })
  bookmarksRouter
  .route('/bookmarks/:bookmark_id')
  .all((req, res, next) => {
    const { bookmark_id } = req.params
    BookmarksService.getById(req.app.get('db'), bookmark_id)
      .then(bookmark => {
        if (!bookmark) {
          return res.status(404).json({
            error: { message: `Bookmark Not Found` }
          })
        }
        res.bookmark = bookmark
        next()
      })
      .catch(next)
  })
  .get((req, res) => {
    res.json(serializeArticle(res.bookmark))
  })
  .delete((req, res, next) => {
    const { bookmark_id } = req.params
    BookmarksService.deleteBookmark(
      req.app.get('db'),
      bookmark_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = bookmarksRouter