import axios from "axios"
//const baseUrl = 'http://localhost:3001/api/persons'
//const baseUrl = 'http://fso-21-phonebook.herokuapp.com/api/persons'
const baseUrl = '/api/persons'

const getAllPersons = () => {
  return axios.get(baseUrl)
    .then(response => response.data)
}

const createPerson = newPerson => {
  return axios.post(baseUrl, newPerson)
    .then(response => response.data)
}

const updatePerson = (id, newPerson) => {
  return axios.put(`${baseUrl}/${id}`, newPerson)
    .then(response => response.data)
}

const deletePerson = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
    .then(response => response.data)
}

const personService = { getAllPersons, createPerson, updatePerson, deletePerson }

export default personService