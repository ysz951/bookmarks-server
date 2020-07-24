const knex = require('knex')
const app = require('../src/app')
const { makeBookmarksArray } = require('./bookmarks.fixtures')
describe('Bookmarks Endpoints', function() {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db('bookmarks').truncate())

  afterEach('cleanup',() => db('bookmarks').truncate())
  
  describe(`GET /bookmarks`, () => {
    context(`Given no bookmarks`, () => {
        it(`responds with 200 and an empty list`, () => {
            return supertest(app)
                .get('/bookmarks')
                .expect(200, [])
        })
    })
    context('Given there are bookmarks in the database', () => {
      const testBookmarks = makeBookmarksArray()

      beforeEach('insert bookmarks', () => {
        return db
          .into('bookmarks')
          .insert(testBookmarks)
      })

      it('responds with 200 and all of the bookmarks', () => {
        return supertest(app)
          .get('/bookmarks')
          .expect(200, testBookmarks)
      })
    })
  })

  describe(`GET /bookmarks/:id`, () => {
    context(`Given no bookmarks`, () => {
        it(`responds with 404`, () => {
            const BookmarkId = 123456
            return supertest(app)
                .get(`/bookmarks/${BookmarkId}`)
                .expect(404, { error: { message: `Bookmark doesn't exist` } })
        })
    })
    context('Given there are bookmarks in the database', () => {
      const testBookmarks = makeBookmarksArray()

      beforeEach('insert bookmarks', () => {
        return db
          .into('bookmarks')
          .insert(testBookmarks)
      })

      it('responds with 200 and the specified bookmark', () => {
        const BookmarkId = 2
        const expectedBookmark = testBookmarks[BookmarkId - 1]
        return supertest(app)
          .get(`/bookmarks/${BookmarkId}`)
          .expect(200, expectedBookmark)
      })
    })
  })
})