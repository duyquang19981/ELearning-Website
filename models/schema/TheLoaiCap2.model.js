const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TheLoaiCap2Schema = new Schema({
    TenTheLoai: String,
    DSKhoaHoc: [{type:mongoose.Schema.Types.ObjectId}],
    SoKhoaHoc: Number,
    
}, {collection:'TheLoaiCap2'})
module.exports = mongoose.model('TheLoaiCap2', TheLoaiCap2Schema);