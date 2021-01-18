const { Double, ObjectID } = require('bson');
const mongoose = require('mongoose');
const { stringify } = require('querystring');
const Schema = mongoose.Schema;

const fsfiles = new Schema({
    length: Number,
    chunkSize: Number,

    uploadDate: {
        type: Date,
    },
    filename : String,
    md5: String,
    contentType:String,
    }
,{collection:'fs.files'})
module.exports = mongoose.model('fs.files', fsfiles);