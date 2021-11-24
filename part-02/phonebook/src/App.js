import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import { Persons } from './components/Persons'

const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')

  useEffect(() => {
    axios.get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const personsToDisplay =
    persons.filter(person =>
      person.name
        .toLowerCase()
        .includes(nameFilter))


  const addName = (e) => {
    e.preventDefault()

    const newPerson = {
      id: persons.length + 1,
      name: newName,
      number: newNumber
    }

    if (persons.filter(person => person.name === newName).length === 0) {
      setPersons(persons.concat(newPerson))
    } else {
      alert(`${newName} is already added to phonebook`)
    }

    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter nameFilter={nameFilter} setNameFilter={setNameFilter} />
      <h2>Add a new</h2>
      <PersonForm
        name={newName}
        setName={setNewName}
        number={newNumber}
        setNumber={setNewNumber}
        handleSubmit={addName}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToDisplay} />
    </div>
  )
}

export default App