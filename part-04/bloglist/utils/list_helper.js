
// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let totalLikeCount = 0
  totalLikeCount = blogs.reduce(
    (totalLikeCount, blog) => {
      return totalLikeCount + blog.likes
    },
    0)

  return totalLikeCount
}

const favouriteBlog = (blogs) => {

  if(blogs === null || blogs.length === 0) {
    return null
  }
  else
  {
    const mostLikedBlog = blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current)
    delete mostLikedBlog._id
    delete mostLikedBlog.__v
    return mostLikedBlog
  }
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog
}