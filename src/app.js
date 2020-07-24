require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const bookmarksRouter = require('./bookmarks/bookmarks-router')
const errorHandler = require('./errorHandler')
const validateBearerToken = require('./validateBearerToken')
const ArticlesService = require('./books-service')
const app = express()

const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common'

app.use(morgan(morganOption))
app.use(helmet())
app.use(express.json())
app.use(cors())

app.use(errorHandler)

// app.use(validateBearerToken)

// app.get('/bookmarks', (req, res, next) => {
//     const knexInstance = req.app.get('db')
//     ArticlesService.getAllArticles(knexInstance)
//         .then(articles => {
//             res.json(articles)
//         })
//         .catch(next)
// })

// app.get('/bookmarks/:id', (req, res, next) => {
//     const knexInstance = req.app.get('db')
//     ArticlesService.getById(knexInstance, req.params.id)
//       .then(book => {
//           if (!book) {
//               return res.status(404).json({
//                   error: { message: `Bookmark doesn't exist` }
//               })
//           }
//           res.json(book)
//       })
//       .catch(next)
// })

app.use(bookmarksRouter)
app.get('/', (req, res) => {
    res.send('Hello, world!')
})


module.exports = app