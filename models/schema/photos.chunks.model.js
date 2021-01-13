const { Double, ObjectID } = require('bson');
const mongoose = require('mongoose');
const { stringify } = require('querystring');
const Schema = mongoose.Schema;

const photoschunks = new Schema({
    files_id: mongoose.Schema.Types.ObjectId,
    n: Number,
    data: mongoose.Schema.Types.Buffer
},{collection:'photos.chunks'})
module.exports = mongoose.model('photos.chunks', photoschunks);