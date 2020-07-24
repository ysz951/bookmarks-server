const express = require('express')
const BookmarksService = require('../books-service')
const bookmarksRouter = express.Router()

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