const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

mongoose.connect(url);

const personSchema = mongoose.Schema({
    name: {
        type: String,
        minLength: 3
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: (v) => {
                return /\d{2,3}-\d/.test(v);
            }
        }
    }
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Person', personSchema);
