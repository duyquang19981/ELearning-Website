const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const HocVienSchema = new Schema({
    Ten: String,
    Mail: String,   
    Username: String,
    Password: String,
    DSKhoaHocDK:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'KhoaHoc'
    }],
    WatchList:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'KhoaHoc'
    }],
    GioHang:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'KhoaHoc'
    }],
    Role : {
        type:Number,
        default:2
    }

}, {collection:'HocVien'});
HocVienSchema.index({ 'Ten': 'text' });
module.exports = mongoose.model('HocVien', HocVienSchema);