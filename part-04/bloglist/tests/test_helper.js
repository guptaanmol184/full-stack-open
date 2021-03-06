
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Why numbering should start at zero',
    author: 'Edsger W. Dijkstra',
    url: 'https://www.cs.utexas.edu/users/EWD/transcriptions/EWD08xx/EWD831.html',
    likes: 10,
  },
]

const nonExistingId = async () => {
  const blog = new Blog(
    {
      title: 'A blog to be deleted',
      author: 'author of blog to be deleted',
      url: 'http://will_be_404.html',
    }
  )
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const notes = await Blog.find({})
  return notes.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports =
{
  initialBlogs,
  blogsInDb,
  nonExistingId,
  usersInDb
}