const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    Username: String,
    Password: String,
    DSBangQL: [{
        _id: mongoose.Schema.Types.ObjectId,
        TenBang:String
    }],
    Role : {
        type:Number,
        default:0
    }
}, {collection:'Admin'})
module.exports = mongoose.model('Admin', AdminSchema);