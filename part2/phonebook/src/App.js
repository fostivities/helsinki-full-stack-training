import { useState } from 'react';

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(searchValue.toLowerCase()));

  const handlePersonSubmit = (event) => {
    event.preventDefault();

    if (isNameInPersons()) {
      const alertMessage = `${newName} is already added to phonebook`;

      alert(alertMessage);
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
        id: persons.length + 1
      };

      setPersons(persons.concat(newPerson));
    }

    setNewName('');
    setNewNumber('');
  }

  const isNameInPersons = () => {
    const isNameInPersons = persons.some(person => person.name.toLowerCase() === newName.toLowerCase());

    return isNameInPersons;
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
      <Persons persons={personsToShow} />
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

const Persons = ({ persons }) => {
  return (
    <div>
      {persons.map(person =>
        <Person key={person.id} person={person} />
      )}
    </div>
  );
};

const Person = ({ person }) => (
  <p>{person.name} {person.number}</p>
);

export default App;
