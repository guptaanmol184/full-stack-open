const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const User = require('../models/user')
const app = require('../app')
const api = supertest(app)

const TIMEOUT = 10000
const USERS_ENDPOINT = '/api/users'

describe('Creating a new user', () => {

  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash =
      await bcrypt
        .hash('123abc!', 10)
    const user = new User({
      name: 'Test User',
      username: 'testuser',
      passwordHash: passwordHash
    })

    await user.save()
  }, TIMEOUT)

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'testuser1',
      name: 'Test User',
      password: '123abc!'
    }

    await api
      .post(USERS_ENDPOINT)
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  }, TIMEOUT)

  test('creation fails with proper status code and message if username already take', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: '123abc!'
    }

    const result = await api
      .post(USERS_ENDPOINT)
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

  test('Creation fails with proper status code and message if the username is not provided', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'Test User',
      password: '123abc!'
    }

    const result = await api
      .post(USERS_ENDPOINT)
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` is required')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

  test('Creation fails with proper status code if username is less than 3 characters long', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ab',
      name: 'Test User',
      password: '123abc!'
    }

    const result = await api
      .post(USERS_ENDPOINT)
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` (`ab`) is shorter than the minimum allowed length (3)')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  }, TIMEOUT)

  test('Creation fails with proper status code if password is not provided', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'test-user',
      name: 'Test User',
    }

    const result = await api
      .post(USERS_ENDPOINT)
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password must min length 3')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

  test('Creation fails with proper status code if password is less than 3 characters long', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'test-user',
      name: 'Test User',
      password: '12'
    }

    const result = await api
      .post(USERS_ENDPOINT)
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password must min length 3')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  }, TIMEOUT)

})

afterAll(async () => {
  await mongoose.connection.close()
})