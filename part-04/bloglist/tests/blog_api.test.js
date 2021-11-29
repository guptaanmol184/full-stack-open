const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const TIMEOUT = 5000

const Blog = require('../models/blog')

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
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, TIMEOUT)

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body.length).toBe(helper.initialBlogs.length)
}, TIMEOUT)

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)
  expect(titles).toContain('Go To Statement Considered Harmful')
}, TIMEOUT)

test('a blog object has id property defined', async () => {
  const response = await api.get('/api/blogs')

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
      .post('/api/blogs')
      .send(newBlog)


  // verify that response for new blog
  expect(reesponse.body.title).toBe(newBlog.title)
  expect(reesponse.body.author).toBe(newBlog.author)
  expect(reesponse.body.url).toBe(newBlog.url)
  expect(reesponse.body.likes).toBe(newBlog.likes)

  // check that new blog is added to database
  const response = await api.get('/api/blogs')
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
      .post('/api/blogs')
      .send(newBlog)

  expect(response.body.likes).toBe(0)
}, TIMEOUT)

test('a blog requires the title property to be defined', async () => {
  const newBlog = {
    author: 'Test author',
    url: 'https://test.blog.html'
  }

  await api
    .post('/api/blogs')
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
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
}, TIMEOUT)


afterAll(async () => {
  await mongoose.connection.close()
})