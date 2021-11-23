export const Persons = ({ persons }) => {
  return (
    persons.map(person => (
      <p key={person.id}>{person.name} {person.number}</p>
    ))
  );
};

export default Persons