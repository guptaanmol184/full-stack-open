import React from "react";

export const Persons = ({ persons, onDeletePerson }) => {
  return (
    persons.map(person => (
      <React.Fragment key={person.id}>
        <p>
          {person.name} {person.number} &nbsp;
          <button onClick={() => onDeletePerson(person)} >delete</button>
        </p>
      </React.Fragment>
    ))
  );
};

export default Persons