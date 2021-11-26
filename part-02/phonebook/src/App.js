import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import personService from './services/persons'
import PersonForm from './components/PersonForm'
import { Persons } from './components/Persons'

const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')

  // Initialize persons from backend
  useEffect(() => {
    personService
      .getAllPersons()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  // Person Filtering
  const personsToDisplay =
    persons.filter(person =>
      person.name
        .toLowerCase()
        .includes(nameFilter))

  // Create (or) Update new Person
  const addName = (e) => {
    e.preventDefault()

    const newPerson = {
      name: newName,
      number: newNumber
    }

    const existingPerson = persons.find(person => person.name === newName);

    if (existingPerson === undefined) {
      personService.createPerson(newPerson)
        .then(createdPerson => setPersons(persons.concat(createdPerson)))
    } else {
      const updateConfirmation =
        window.confirm(`${newName} is already added to phonebook, replace the old number with a new one ?`)
      if (updateConfirmation) {
        personService.updatePerson(existingPerson.id, newPerson)
          .then(updatedPerson =>
            setPersons(persons.map(person => {
              return person.id === existingPerson.id
                ? updatedPerson
                : person
            })))
          .catch(error => {
            console.log(`Server returned error: ${error}`);
            alert(`Server was unable to update ${existingPerson.name}. Please refresh to fetch latest information from the server.`)
          })
      }
    }

    setNewName('')
    setNewNumber('')
  }

  // Delete Person
  const deletePerson = (personToDelete) => {
    const confirmation = window.confirm(`Delete ${personToDelete.name} ?`)

    if (confirmation) {
      personService.deletePerson(personToDelete.id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== personToDelete.id))
        })
        .catch(error => {
          console.log(`Server returned error: ${error}`);
          alert(`The person ${personToDelete.name} was already deleted from server.`)
          setPersons(persons.filter(p => p.id !== personToDelete.id))
        })
    }
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
      <Persons persons={personsToDisplay} onDeletePerson={deletePerson} />
    </div>
  )
}

export default App