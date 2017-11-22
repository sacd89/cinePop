const mongoose = require('mongoose');
const schema = mongoose.Schema;
const classificationTypes = ['A','B', 'B15', 'C'];

var movieSchema = schema({
    name: String,
    duration: Number,
    classificationType: {type:String, enum:classificationTypes},
    linkPoster: String
});

let Movie = mongoose.model('Movie', movieSchema);
module.exports = {
    Movie,
    classificationTypes
};