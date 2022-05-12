const mongoose = require('mongoose');

// if (process.argv.length < 5) {
//     console.log('Too few arguments: node mongo.js <password> <name');
//     process.exit(1);
// }

if (process.argv.length < 3) {
    console.log('Please provide a password: node mongo.js <password>');
    process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://fullstack2:${password}@cluster0.flyqg.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = mongoose.Schema({
    name: String,
    number: String
});

const Person = new mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
    Person
        .find({})
        .then(result => {
            console.log('phonebook:');

            result.forEach(person => {
                console.log(`${person.name} ${person.number}`);
            });

            mongoose.connection.close();
        });
} else if (process.argv.length === 5) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    });

    person.save().then(() => {
        console.log(`added ${person.name} number ${person.number} to phonebook`);
        mongoose.connection.close();
    });
} else {
    console.log('Improper number of parameters');
    console.log('For saving a person: node mongo.js <password> "<name>" <number>');
    console.log('For finding all persons: node mongo.js <password>');
    process.exit(1);
}