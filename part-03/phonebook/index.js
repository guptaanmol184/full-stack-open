// import dotenv defined environment variables
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()
app.use(express.static('build'))
app.use(cors())
app.use(express.json())

morgan.token('post-body', (request, response) => {
  return request.method === 'POST'
    ? JSON.stringify(request.body)
    : null
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :post-body')
)

const BASE_URL = '/api/persons'

// Info api
app.get(`${BASE_URL}/info`, (request, response, next) => {

  Person
  .find({})
  .then(persons => {
    let personCount = persons.length
    bodyString =
      [`<p>Phonebook has info for ${personCount} people.</p>`,
      `<p>Server Time: ${Date()}</p>`]
        .join('\n')
    response.send(bodyString)
  })
  .catch(error => next(error))
})

// List all persons
app.get(`${BASE_URL}`, (request, response, next) => {
  Person
  .find({})
  .then(persons => {
    response.json(persons)
  })
  .catch(error => next(error))
})

// Query person by id
app.get(`${BASE_URL}/:id`, (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if(person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

// Delete person by id
app.delete(`${BASE_URL}/:id`, (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
    })
  .catch(error => next(error))
})

// Add new person
app.post(`${BASE_URL}`, (request, response, next) => {

  let newPerson = request.body

  if (!newPerson.name) {
    return response
      .status(400)
      .json({
        error: 'name missing'
      })
  }

  if (!newPerson.number) {
    return response
      .status(400)
      .json({
        error: 'number missing'
      })
  }

  const person = new Person({
    number: newPerson.number,
    name: newPerson.name
  }) 
  person.save()
  .then(savedPerson => response.json(savedPerson))
  .catch(error => next(error))


})

// Update existing person
app.put(`${BASE_URL}/:id`, (request, response, next) => {
  const body = request.body

  if (!body.name) {
    return response
      .status(400)
      .json({
        error: 'name missing'
      })
  }

  if (!body.number) {
    return response
      .status(400)
      .json({
        error: 'number missing'
      })
  }

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

// handler of requests with unknown endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)


// handlers for request with result to errors
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if(error.name === 'CastError') {
    return response.status(400).send({error: 'malformatted id'})
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`)
})