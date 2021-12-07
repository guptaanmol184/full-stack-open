const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)

const TIMEOUT = 10000
const BLOGS_ENDPOINT = '/api/blogs'

const Blog = require('../models/blog')
const User = require('../models/user')

describe('when there is initially some blogs saved', () => {

  let token
  let userId

  beforeEach(async () => {
    // Setup new user for blog
    await User.deleteMany({});

    const testUsername = 'testuser'
    const testPassword = '123abc!'
    const passwordHash = await bcrypt.hash(testPassword, 10);
    const user = new User({
      name: "Test User",
      username: testUsername,
      passwordHash: passwordHash
    });

    userSaveResult = await user.save();
    userId = userSaveResult._id.toString();

    // Add blogs
    await Blog.deleteMany({})
    //console.log('cleared blogs')

    for (let blog of helper.initialBlogs) {

      blog.user = userSaveResult._id
      let blogObject = new Blog(blog)
      blogSaveResult = await blogObject.save()

      user.blogs = user.blogs.concat(blogSaveResult._id)
      await user.save()

      //console.log('saved a blog')
    }

    //console.log('done adding blogs')


    // login user
    loginResult = await api
      .post('/api/login')
      .send({
        username: testUsername,
        password: testPassword
      })
    token = loginResult.body.token
  }, TIMEOUT)

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

      expect(resultBlog.body.title).toEqual(blogToView.title)
      expect(resultBlog.body.author).toEqual(blogToView.author)
      expect(resultBlog.body.url).toEqual(blogToView.url)
      expect(resultBlog.body.likes).toEqual(blogToView.likes)
      expect(resultBlog.body.user).toEqual(userId)
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

    test('addition of a new blog fails with 401 Unauthorized if token is not provided', async () => {
      const newBlog = {
        title: 'Test blog',
        author: 'Test author',
        url: 'https://test.blog.html',
        likes: 10
      }

      const result =
        await api
          .post(BLOGS_ENDPOINT)
          .send(newBlog)
          .expect(401)
    })

    test('a valid blog object is added on post request', async () => {
      const newBlog = {
        title: 'Test blog',
        author: 'Test author',
        url: 'https://test.blog.html',
        likes: 10
      }

      const result =
        await api
          .post(BLOGS_ENDPOINT)
          .send(newBlog)
          .set('Authorization', `bearer ${token}`)
          .expect(201)

      // verify that response for new blog
      expect(result.body.title).toBe(newBlog.title)
      expect(result.body.author).toBe(newBlog.author)
      expect(result.body.url).toBe(newBlog.url)
      expect(result.body.likes).toBe(newBlog.likes)
      expect(result.body.user).toBe(userId)

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
          .set('Authorization', `bearer ${token}`)
          .expect(201)

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
        .set('Authorization', `bearer ${token}`)
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
        .set('Authorization', `bearer ${token}`)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
    }, TIMEOUT)
  })

  describe('deletion of a blog', () => {
    test('deletion of a blog fails with status 401 if token is not provided', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`${BLOGS_ENDPOINT}/${blogToDelete.id}`)
        .expect(401)
    })

    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`${BLOGS_ENDPOINT}/${blogToDelete.id}`)
        .set('Authorization', `bearer ${token}`)
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