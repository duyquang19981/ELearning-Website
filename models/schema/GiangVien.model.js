const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GiangVienSchema = new Schema({
    Ten: String,
    Mail: String,
    User: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    DSKhoaHocDay:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'KhoaHoc'
    }]

}, {collection:'GiangVien'})
module.exports = mongoose.model('GiangVien', GiangVienSchema);