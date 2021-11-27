const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
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

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

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
  response.json(persons)
})

// Query person by id
app.get(`${BASE_URL}/:id`, (request, response) => {
  const personId = Number(request.params.id)

  foundPerson = persons.find(p => p.id === personId)

  if (foundPerson) {
    response.json(foundPerson)
  } else {
    response.status(404).end()
  }
})

// Delete person by id
app.delete(`${BASE_URL}/:id`, (request, response) => {
  const personId = Number(request.params.id)

  persons = persons.filter(p => p.id != personId)

  response.status(204).end()
})

const generateId = () => {
  return Math.floor(Math.random() * 100)
}

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

  if (persons.findIndex(p => p.name === newPerson.name) !== -1) {
    return response
      .status(400)
      .json({
        error: 'name must be unique'
      })
  }

  let newPersonId = -1
  do {
    newPersonId = generateId()
  } while (persons.findIndex(p => p.id == newPersonId) !== -1)

  newPerson.id = newPersonId
  persons = persons.concat(newPerson)

  response.json(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`)
})