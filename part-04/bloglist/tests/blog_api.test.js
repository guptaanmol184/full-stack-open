const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const TIMEOUT = 5000
const BLOGS_ENDPOINT = '/api/blogs'

const Blog = require('../models/blog')

describe('when there is initially some blogs saved', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
    console.log('cleared blogs')

    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()

      console.log('saved a blog')
    }

    console.log('done adding blogs')
  })

  test('blogs are returned as json', async () => {
    await api
      .get(BLOGS_ENDPOINT)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, TIMEOUT)

  test('all blogs are returned', async () => {
    const response = await api.get(BLOGS_ENDPOINT)

    expect(response.body.length).toBe(helper.initialBlogs.length)
  }, TIMEOUT)

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get(BLOGS_ENDPOINT)

    const titles = response.body.map(r => r.title)
    expect(titles).toContain('Go To Statement Considered Harmful')
  }, TIMEOUT)

  describe('viewing a specific blog', () => {
    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const blogToView = blogsAtStart[0]

      const resultBlog = await api
        .get(`${BLOGS_ENDPOINT}/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(resultBlog.body).toEqual(blogToView)
    })

    test('fails with statuscode 404 if note does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      await api
        .get(`${BLOGS_ENDPOINT}/${validNonexistingId}`)
        .expect(404)
    })

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .get(`${BLOGS_ENDPOINT}/${invalidId}`)
        .expect(400)
    })
  })

  describe('addition of a new blog', () => {
    test('a blog object has id property defined', async () => {
      const response = await api.get(BLOGS_ENDPOINT)

      const blog = response.body[0]
      expect(blog.id).toBeDefined()
    }, TIMEOUT)

    test('a valid blog object is added on post request', async () => {
      const newBlog = {
        title: 'Test blog',
        author: 'Test author',
        url: 'https://test.blog.html',
        likes: 10
      }

      const reesponse =
        await api
          .post(BLOGS_ENDPOINT)
          .send(newBlog)


      // verify that response for new blog
      expect(reesponse.body.title).toBe(newBlog.title)
      expect(reesponse.body.author).toBe(newBlog.author)
      expect(reesponse.body.url).toBe(newBlog.url)
      expect(reesponse.body.likes).toBe(newBlog.likes)

      // check that new blog is added to database
      const response = await api.get(BLOGS_ENDPOINT)
      expect(response.body.length).toBe(helper.initialBlogs.length + 1)
    }, TIMEOUT)

    test('when creating blog object without likes property defined, likes default to 0', async () => {
      const newBlog = {
        title: 'Test blog without likes',
        author: 'Test author',
        url: 'https://test.blog.html'
      }

      const response =
        await api
          .post(BLOGS_ENDPOINT)
          .send(newBlog)

      expect(response.body.likes).toBe(0)
    }, TIMEOUT)

    test('a blog requires the title property to be defined', async () => {
      const newBlog = {
        author: 'Test author',
        url: 'https://test.blog.html'
      }

      await api
        .post(BLOGS_ENDPOINT)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
    }, TIMEOUT)

    test('a blog requires the url property to be defined', async () => {
      const newBlog = {
        title: 'Test blog without likes',
        author: 'Test author',
      }

      await api
        .post(BLOGS_ENDPOINT)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
    }, TIMEOUT)
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`${BLOGS_ENDPOINT}/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd.length).toBe(
        helper.initialBlogs.length - 1
      )

      const titles = blogsAtEnd.map(r => r.title)

      expect(titles).not.toContain(blogToDelete.title)
    })
  })
})


afterAll(async () => {
  await mongoose.connection.close()
})