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

const errorHandler = (error, request, response, next) => {
    console.log(error);

    if (error.name === 'CastError') {
        return response.status(400).json({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    }

    next(error);
};

app.use(express.json());
app.use(morganFormat);
app.use(cors());
app.use(express.static('build'));

app.get('/api/persons', (request, response) => {
    Person.find({}).then(results => {
        response.send(results);
    });
});

app.get('/api/persons/:id', (request, response, next) => {
    Person
        .findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person);
            } else {
                response.status(404).send({ error: 'No person found' });
            }
        })
        .catch(error => next(error));
});

app.get('/api/info', (request, response) => {
    const numberOfPersons = persons.length;
    const currentDateTime = new Date();

    response.send(`<p>Phone book has info for ${numberOfPersons} people</p><p>${currentDateTime}</p>`);
});

app.delete('/api/persons/:id', (request, response, next) => {
    Person
        .findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end();
        })
        .catch(error => next(error));
});

app.post('/api/persons', (request, response, next) => {
    const newName = request.body.name;
    const newNumber = request.body.number;

    const person = new Person({
        name: newName,
        number: newNumber
    });

    person.find({ name: newName }).then(person => {
        if (!person) {
            person
                .save()
                .then(result => {
                    response.json(result);
                })
                .catch(error => next(error));
        } else {
            response.status(409).json({ error: 'Person already exists' });
        }
    });


});

app.put('/api/persons/:id', (request, response, next) => {
    const person = {
        name: request.body.name,
        number: request.body.number
    };

    Person
        .findByIdAndUpdate(
            request.params.id,
            person,
            { new: true, runValidators: true, context: 'query' }
        )
        .then(updatedPerson => {
            response.json(updatedPerson);
        })
        .catch(error => next(error));
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server now listening on ${PORT}`);
});
