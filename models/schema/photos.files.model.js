const { Double, ObjectID } = require('bson');
const mongoose = require('mongoose');
const { stringify } = require('querystring');
const Schema = mongoose.Schema;

const photosfiles = new Schema({
    length: Number,
    chunkSize: Number,

    uploadDate: {
        type: Date,
    },
    filename : String,
    md5: String,
    contentType:String,
    }
,{collection:'photos.files'})
module.exports = mongoose.model('photos.files', photosfiles);