
const { Double, ObjectID } = require('bson');
const mongoose = require('mongoose');
const { stringify } = require('querystring');
const Schema = mongoose.Schema;

const DanhGiaSchema = new Schema({
    idKhoaHoc: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'KhoaHoc'
    },
    idHocVien: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'HocVien'
    },
    DiemDanhGia:{
        type:Number,
        min:0,
        max:5
    },
    PhanHoi:String,
    NgayDang: Date
}, {collection:'DanhGia'})

module.exports = mongoose.model('DanhGia', DanhGiaSchema);