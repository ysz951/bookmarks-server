const express = require('express')
const { v4: uuid } = require('uuid')
const logger = require('../logger')
const { bookmarks } = require('../store')
const validUrl = require('valid-url')
const bookmarksRouter = express.Router()
const bodyParser = express.json()

bookmarksRouter
  .route('/bookmarks')
  .get((req, res) => {
    res.json(bookmarks)
  })
  .post(bodyParser, (req, res) => {
    const {title, url, description = "", rating} = req.body
    for (let field of ['title', 'url', 'rating']) {
      if (!req.body[field]){
        logger.error(`'${field}' is required`)
        return res
        .status(400)
        .send(`'${field}' is required`)
      }
    }

    if (!validUrl.isWebUri(url)) {
        logger.error(`${url} is not a valid URL`)
        return res
        .status(400)
        .send(`'url' should be a valid URL`)
    }

    if (!Number.isInteger(rating) || rating < 0 || rating > 5){
        logger.error(`${rating} is not a valid rating number`)
        return res
        .status(400)
        .send(`'rating' should be an integer between 0 and 5`)
    }

    const id = uuid()
    const bookmark = {
        id,
        title,
        url,
        description,
        rating
    }

    bookmarks.push(bookmark)
    logger.info(`Bookmark with id ${id} created`)
    res
        .status(201)
        .location(`http://localhost:8000/card/${id}`)
        .json(bookmark)
})

bookmarksRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
    const { id } = req.params
    const bookmark = bookmarks.find(b => b.id == id)

    if (!bookmark) {
      logger.error(`Bookmark with id ${id} not found.`)
      return res
        .status(404)
        .send('Bookmark Not Found')
    }
  
    res.json(bookmark)
  })
  .delete((req, res) => {
    const { id } = req.params

    const bookmarksIndex = bookmarks.findIndex(b => b.id == id)

    if (bookmarksIndex === -1) {
        logger.error(`Bookmark with id ${id} not found.`)
        return res
        .status(404)
        .send('Not found')
    }

    bookmarks.splice(bookmarksIndex, 1)

    logger.info(`Bookmark with id ${id} deleted.`)

    res
        .status(204)
        .end()
  })

module.exports = bookmarksRouter