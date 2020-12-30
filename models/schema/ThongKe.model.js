const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ThongKeSchema = new Schema({
    KhoaHocNoiBat:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'KhoaHoc'
    },
    KhoaHocXemNhieu:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'KhoaHoc'
    },
    KhoaHocMoiNhat:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'KhoaHoc'
    },
    LinhVucDKNhieu:{
        idLinhVuc:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'TheLoaiCap2'
        },
        KhoaHoc:[{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'KhoaHoc'
        }]
    }
}, {collection:'ThongKe'})
module.exports = mongoose.model('ThongKe', ThongKeSchema);