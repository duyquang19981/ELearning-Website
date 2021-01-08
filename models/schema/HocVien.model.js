const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HocVienSchema = new Schema({
    Ten: String,
    Mail: String,
    Username: String,
    Password: String,
    DSKhoaHocDK:[{
        KhoaHoc:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'KhoaHoc'
        },
        TrangThai:[{type: mongoose.Schema.Types.Number}]
    }],
    WatchList:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'KhoaHoc'
    }],
    GioHang:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'KhoaHoc'
    }]

}, {collection:'HocVien'})
HocVienSchema.index({ 'Ten': 'text' });
module.exports = mongoose.model('HocVien', HocVienSchema);