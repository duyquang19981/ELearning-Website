const { Double, ObjectID } = require('bson');
const mongoose = require('mongoose');
const { stringify } = require('querystring');
const Schema = mongoose.Schema;

const fschunks = new Schema({
    files_id: mongoose.Schema.Types.ObjectId,
    n: Number,
    data: mongoose.Schema.Types.Buffer
},{collection:'fs.chunks'})
module.exports = mongoose.model('fs.chunks', fschunks);