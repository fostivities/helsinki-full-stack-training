import { useState, useEffect } from 'react';

import personsService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(searchValue.toLowerCase()));

  useEffect(() => {
    personsService
      .getPersons()
      .then(initialPersons => {
        setPersons(initialPersons);
      });
  }, []);

  const handlePersonSubmit = (event) => {
    event.preventDefault();

    const matchingPerson = persons.find(person => person.name.toLowerCase() === newName.toLowerCase());

    if (matchingPerson) {
      const isUpdateConfirmed = window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`);

      if (isUpdateConfirmed) {
        matchingPerson.number = newNumber;

        personsService
          .updatePerson(matchingPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== returnedPerson.id ? person : returnedPerson));
          });
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber
      };

      personsService
        .addPerson(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
        });
    }

    setNewName('');
    setNewNumber('');
  }

  const deletePersonById = (id) => {
    const personToDelete = persons.find(person => person.id === id);
    const isDeleteConfirmed = window.confirm(`Delete ${personToDelete.name}?`);

    if (isDeleteConfirmed) {
      personsService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
        });
    }
  }

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchValue={searchValue} handleSearchChange={handleSearchChange} />

      <h2>add a new</h2>
      <PersonForm
        handlePersonSubmit={handlePersonSubmit}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange} />

      <h2>Numbers</h2>
      <Persons persons={personsToShow} deletePerson={deletePersonById} />
    </div>
  );
};

const Filter = ({ searchValue, handleSearchChange }) => (
  <input value={searchValue} onChange={handleSearchChange} />
);

const PersonForm = ({ handlePersonSubmit, newName, handleNameChange, newNumber, handleNumberChange }) => {
  return (
    <form onSubmit={handlePersonSubmit}>
      <div>name: <input value={newName} onChange={handleNameChange} /></div>
      <div>number: <input value={newNumber} onChange={handleNumberChange} /></div>
      <div> <button type="submit">add</button></div>
    </form>
  );
};

const Persons = ({ persons, deletePerson }) => {
  return (
    <div>
      {persons.map(person =>
        <Person key={person.id} person={person} handleDeletePerson={() => deletePerson(person.id)} />
      )}
    </div>
  );
};

const Person = ({ person, handleDeletePerson }) => (
  <p>
    {person.name} {person.number}
    <button onClick={handleDeletePerson}>delete</button>
  </p>
);

export default App;
