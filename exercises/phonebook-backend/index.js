require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const Person = require('./models/person');

const app = express();
const PORT = process.env.PORT;

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
];

morgan.token('postFormat', (req, res) => {
    return JSON.stringify(req.body)
});

const morganFormat = morgan((tokens, req, res) => {
    const tokensList = [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ];

    if (req.method === 'POST' && req.body) {
        tokensList.push(tokens['postFormat'](req, res));
    }

    return tokensList.join(' ');
});

app.use(express.json());
app.use(morganFormat);
app.use(cors());
app.use(express.static('build'));

app.get('/api/persons', (request, response) => {
    Person.find({}).then(results => {
        response.send(results);
    });
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);

    if (person) {
        response.send(person);
    } else {
        response.status(404).send('Person does not exist');
    }
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();
});

app.post('/api/persons', (request, response) => {
    // const newId = Math.floor(Math.random() * 1000);
    const newName = request.body.name;
    const newNumber = request.body.number;
    // const isNameInPhonebook = persons.some(person => person.name.toLowerCase() === newName.toLowerCase());

    // if (!newName || !newNumber) {
    //     return response.status(400).json({
    //         error: 'Missing request information'
    //     });
    // } else if (isNameInPhonebook) {
    //     return response.status(400).json({
    //         error: 'Name must be unique'
    //     });
    // }

    // persons = persons.concat(newPerson);

    // response.json(newPerson);

    const person = new Person({
        name: newName,
        number: newNumber
    });

    person.save().then(result => {
        response.json(result);
    });
});

app.get('/api/info', (request, response) => {
    const numberOfPersons = persons.length;
    const currentDateTime = new Date();

    response.send(`<p>Phone book has info for ${numberOfPersons} people</p><p>${currentDateTime}</p>`);
});

app.listen(PORT, () => {
    console.log(`Server now listening on ${PORT}`);
});