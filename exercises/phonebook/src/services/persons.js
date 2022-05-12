import axios from 'axios';

const endpoint = 'api/persons';

const getPersons = () => {
    const result = axios.get(endpoint);
    return result.then(response => response.data);
}

const addPerson = (newPerson) => {
    const result = axios.post(endpoint, newPerson);
    return result.then(response => response.data);
}

const deletePerson = (id) => {
    const result = axios.delete(`${endpoint}/${id}`);
    return result.then(response => response.data);
}

const updatePerson = (updatedPerson) => {
    const result = axios.put(`${endpoint}/${updatedPerson.id}`, updatedPerson);
    return result.then();
}

export default { getPersons, addPerson, deletePerson, updatePerson };