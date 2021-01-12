const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GiangVienSchema = new Schema({
    Ten: String,
    Mail: String,
    Username: String,
    Password: String,
    DSKhoaHocDay:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'KhoaHoc'
    }],
    Role : {
        type:Number,
        default:1
    }

}, {collection:'GiangVien'})
GiangVienSchema.index({ 'Ten': 'text' });
module.exports = mongoose.model('GiangVien', GiangVienSchema);