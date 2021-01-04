const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    Username: String,
    Password: String,
    DSBangQL: [{
        _id: mongoose.Schema.Types.ObjectId,
        TenBang:String
    }]
}, {collection:'Admin'})
module.exports = mongoose.model('Admin', AdminSchema);