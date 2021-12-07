const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs
    = await Blog
      .find({})
      .populate('user', {
        username: 1,
        name: 1
      })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response, next) => {
  const body = request.body

  if (!request.user) {
    response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = request.user

  const blog = new Blog({
    title: body.title,
    url: body.url,
    author: body.author,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.get('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const blog = request.body
  const updatedBlog =
    await Blog
      .findByIdAndUpdate(request.params.id,
        blog,
        { new: true })
  response.json(updatedBlog.toJSON())
})

blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {

  if (!request.user) {
    response.status(401).json({ error: 'token missing or invalid' })
  }

  const blogToDelete = await Blog.findById(request.params.id)
  const user = request.user

  if (blogToDelete && blogToDelete.user.toString() === user._id.toString()) {
    await blogToDelete.remove()
    user.blogs = user.blogs.filter(blogId => blogId.toString() !== blogToDelete._id.toString())
    await user.save()
  } else {
    response
      .status(401)
      .json({ error: 'User is not the owner of the blog' })
  }

  response
    .status(204)
    .end()
})

module.exports = blogsRouter