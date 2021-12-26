describe('Blog agg', function () {

  const testUser = {
    username: 'test_user',
    password: 'testuser123',
    name: 'Test User'
  }

  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users', testUser)
    cy.visit('http://localhost:3000')
  })

  it('front page can be opened', function () {
    cy.contains('Blogs')
  })

  describe('login-in test', function () {
    it('login form can be opened', function () {
      cy.contains('login').click()
    })

    it('a valid user can log in', function () {
      cy.contains('login').click()
      cy.get('#username').type(testUser.username)
      cy.get('#password').type(testUser.password)
      cy.get('#login-button').click()

      cy.contains(`${testUser.name}, you are logged in now!`)
    })

    it('login fails with wrong user', function () {
      cy.contains('login').click()
      cy.get('#username').type('wront user')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'Invalid credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
      cy.get('html').should('not.contain', `${testUser.name}, you are logged in now!`)
    })

    it('login fails with wrong password', function () {
      cy.contains('login').click()
      cy.get('#username').type(testUser.username)
      cy.get('#password').type('wrong password')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'Invalid credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
      cy.get('html').should('not.contain', `${testUser.name}, you are logged in now!`)
    })
  })

  describe('when logged in', function () {
    beforeEach(function () {
      cy.login({
        username: testUser.username,
        password: testUser.password
      })
    })

    it('a new blog can be created', function () {
      cy.contains('button', 'Add new blog').click()
      cy.get('input[name="blogTitle"]').type('Test Blog Title by cypress')
      cy.get('input[name="blogAuthor"]').type('Test Blog Author by cypress')
      cy.get('input[name="blogUrl"]').type('www.testblogurl.com')
      cy.contains('button', 'add').click()
      cy.contains('Test Blog Title by cypress')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'Another Test Blog Title by cypress',
          author: 'Another Test Blog Author by cypress',
          url: 'www.anothertestblogurl.com'
        })
        cy.reload()
        cy.get('.blog').parent().as('theBlog')
      })

      it('blog can be viewed', function () {
        cy.get('@theBlog').contains('Another Test Blog Title by cypress')
        cy.get('@theBlog').contains('button', 'view').click()

        cy.get('@theBlog').contains('Url: www.anothertestblogurl.com')
        cy.get('@theBlog').contains('Author: Another Test Blog Author by cypress')
        cy.get('@theBlog').contains('Likes: 0')
      })

      it('blog can be viewed and hidden again', function () {
        cy.get('@theBlog').contains('button', 'view').click()

        cy.get('@theBlog').contains('button', 'hide').click()
        cy.get('@theBlog').contains('Url: www.anothertestblogurl.com').should('not.exist')
        cy.get('@theBlog').contains('Author: Another Test Blog Author by cypress').should('not.exist')
        cy.get('@theBlog').contains('Likes: 0').should('not.exist')
      })

      it('blog can be liked', function () {
        cy.get('@theBlog').contains('button', 'view').click()

        cy.get('@theBlog').contains('Likes: 0')
        cy.get('@theBlog').contains('button', 'like').click()
        cy.get('@theBlog').contains('Likes: 1')
        cy.get('@theBlog').contains('button', 'like').click()
        cy.get('@theBlog').contains('Likes: 2')
      })

      it('blog can be deleted', function () {
        cy.get('@theBlog').contains('button', 'view').click()

        cy.get('@theBlog').contains('button', 'remove').click()
        cy.get('@theBlog').should('not.contain')

      })
    })

    describe('and multile blogs exists', function () {

      const testBlogs = [
        {
          title: 'Test Blog Title 1',
          author: 'Test Blog Author 1',
          url: 'www.testblog1.com'
        }, {
          title: 'Test Blog Title 2',
          author: 'Test Blog Author 2',
          url: 'www.testblog2.com'
        }
      ]

      beforeEach(function () {
        testBlogs.forEach(testBlog => cy.createBlog(testBlog))
        cy.reload()
      })

      it('blogs are sorted by number of likes', function () {

        cy.get('.blog').contains('Test Blog Title 1').parent().as('blogOne')
        cy.get('.blog').contains('Test Blog Title 2').parent().as('blogTwo')

        cy.get('@blogOne').contains('button', 'view').click()
        cy.get('@blogOne').contains('button', 'like').click()
        cy.get('@blogOne').contains('Likes: 1')

        cy.get('@blogTwo').contains('button', 'view').click()
        cy.get('@blogTwo').contains('button', 'like').click()
        cy.get('@blogTwo').contains('Likes: 1')
        cy.get('@blogTwo').contains('button', 'like').click()
        cy.get('@blogTwo').contains('Likes: 2')

        cy.get('.blog:first').contains('Likes: 2')
        cy.get('.blog:first').contains('Title: Test Blog Title 2')
        cy.get('.blog:last').contains('Likes: 1')
        cy.get('.blog:last').contains('Title: Test Blog Title 1')

      })

    })

  })
})