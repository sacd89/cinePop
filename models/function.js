const mongoose = require('mongoose');
const schema = mongoose.Schema;
const languageTypes = ['EN','ES'];

var functionSchema = schema({
    movie: {type: schema.ObjectId, ref: 'Movie'},
    language: {type: String, enum:languageTypes},
    date: String,
    hour: String
});

let Function = mongoose.model('Function', functionSchema);
module.exports = {
    Function,
    languageTypes
};