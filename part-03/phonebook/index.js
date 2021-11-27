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
app.get(`${BASE_URL}/info`, (request, response) => {
  bodyString =
    [`<p>Phonebook has info for ${persons.length} people.</p>`,
    `<p>Server Time: ${Date()}</p>`]
      .join('\n')

  response.send(bodyString)
})

// List all persons
app.get(`${BASE_URL}`, (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// Query person by id
app.get(`${BASE_URL}/:id`, (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

// Delete person by id
app.delete(`${BASE_URL}/:id`, (request, response) => {
  const personId = Number(request.params.id)

  persons = persons.filter(p => p.id != personId)

  response.status(204).end()
})

// Add new person
app.post(`${BASE_URL}`, (request, response) => {

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

// TODO: Ensuring no duplicate names are added to the db
//  if (persons.findIndex(p => p.name === newPerson.name) !== -1) {
//    return response
//      .status(400)
//      .json({
//        error: 'name must be unique'
//      })
//  }

  const person = new Person({
    number: newPerson.number,
    name: newPerson.name
  }) 
  person.save()
  .then(savedPerson => response.json(savedPerson))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`)
})