const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TheLoaiCap1Schema = new Schema({
    TenTheLoai: String,
    TheLoaiCon: [{type:mongoose.Schema.Types.ObjectId, ref:'TheLoaiCap2'}],
    DS5KhoaMuaNhieu: [{type:mongoose.Schema.Types.ObjectId, ref:'KhoaHoc'}],
    SoKhoaHoc : Number,
}, {collection:'TheLoaiCap1'})
module.exports = mongoose.model('TheLoaiCap1', TheLoaiCap1Schema);