const express = require('express')
const ArticlesService = require('../books-service')
const bookmarksRouter = express.Router()

bookmarksRouter
  .route('/bookmarks')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    ArticlesService.getAllArticles(knexInstance)
        .then(articles => {
            res.json(articles)
        })
        .catch(next)
    // res.json(bookmarks)
  })

bookmarksRouter
  .route('/bookmarks/:id')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    ArticlesService.getById(knexInstance, req.params.id)
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