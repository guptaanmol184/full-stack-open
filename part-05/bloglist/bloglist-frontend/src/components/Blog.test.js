import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  let blog
  let component
  let mockHandleUpdateBlogLikeCount
  let mockHandleDeleteBlog

  beforeEach(() => {
    blog = {
      title: 'Hello world!',
      likes: 10,
      author: 'Blog Author',
      id: '1234',
      url: 'www.blog.url'

    }

    mockHandleUpdateBlogLikeCount = jest.fn()
    mockHandleDeleteBlog = jest.fn()

    component = render(
      <Blog blog={blog}
        handleUpdateBlogLikeCount={mockHandleUpdateBlogLikeCount}
        handleDeleteBlog={mockHandleDeleteBlog}
      />
    )
  })

  test('renders only Blog title when not expanded', () => {
    expect(component.container).toHaveTextContent(blog.title)
    expect(component.container).not.toHaveTextContent(blog.author)
    expect(component.container).not.toHaveTextContent(blog.url)
    expect(component.container).not.toHaveTextContent(blog.likes)
  })

  test('hides Blog details on click of hide button', () => {
    const viewButton = component.getByText('view')
    fireEvent.click(viewButton)
    const hideButton = component.getByText('hide')
    fireEvent.click(hideButton)

    expect(component.container).toHaveTextContent(blog.title)
    expect(component.container).not.toHaveTextContent(blog.author)
    expect(component.container).not.toHaveTextContent(blog.url)
    expect(component.container).not.toHaveTextContent(blog.likes)
  })

  test('clicking like button twice calls the event handler twice', () => {
    const viewButton = component.getByText('view')
    fireEvent.click(viewButton)

    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(mockHandleUpdateBlogLikeCount.mock.calls).toHaveLength(2)
  })

  test('clicking remove button calls the blog delete event handler', () => {
    // accept all window.confirm
    window.confirm = jest.fn().mockImplementation(() => true)

    const viewButton = component.getByText('view')
    fireEvent.click(viewButton)
    const deleteButton = component.getByText('remove')
    fireEvent.click(deleteButton)

    expect(mockHandleDeleteBlog.mock.calls).toHaveLength(1)
  })
})