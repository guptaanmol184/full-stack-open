const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('totalLikes', () => {
  test('when list has no blogs, likes equal to 0', () => {
    const listWithoutBlogs = []

    expect(listHelper.totalLikes(listWithoutBlogs))
      .toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      }
    ]
    expect(listHelper.totalLikes(listWithOneBlog))
      .toBe(5)
  })

  test('when list has only many blog, likes should be sum of all likes', () => {
    const listWithManyBlogs = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f9',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 2,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f2',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 10,
        __v: 0
      }
    ]
    expect(listHelper.totalLikes(listWithManyBlogs))
      .toBe(17)
  })
})

describe('favouriteBlog', () => {

  test('when list has no blogs, favourite blog is null', () => {
    const listWithoutBlogs = []

    expect(listHelper.favouriteBlog(listWithoutBlogs))
      .toEqual(null)
  })

  test('when list has one blog, is the blog in the list', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      }
    ]

    let mostlikedBlog = listWithOneBlog[0]
    delete mostlikedBlog._id
    delete mostlikedBlog.__v

    expect(listHelper.favouriteBlog(listWithOneBlog))
      .toEqual(mostlikedBlog)
  })

  test('when list has two blogs with different like count, result is the blog with greater like count', () => {
    const listWithTwoBlogsHavingDifferentLikeCount = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 10,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f5',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      }
    ]

    let mostlikedBlog = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 10,
    }

    expect(listHelper.favouriteBlog(listWithTwoBlogsHavingDifferentLikeCount))
      .toEqual(mostlikedBlog)
  })

  test('when list has two blogs with same like count, result is any of the blogs', () => {
    const listWithTwoBlogsHavingDifferentLikeCount = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Why numbering should start at zero',
        author: 'Edsger W. Dijkstra',
        url: 'https://www.cs.utexas.edu/users/EWD/transcriptions/EWD08xx/EWD831.html',
        likes: 10,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f5',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 10,
        __v: 0
      }
    ]

    let mostlikedBlog = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 10,
    }

    expect(listHelper.favouriteBlog(listWithTwoBlogsHavingDifferentLikeCount))
      .toEqual(mostlikedBlog)
  })

})