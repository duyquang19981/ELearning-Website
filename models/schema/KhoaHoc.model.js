const { Double, ObjectID } = require('bson');
const mongoose = require('mongoose');
const { stringify } = require('querystring');
const Schema = mongoose.Schema;

const KhoaHocSchema = new Schema({
    TenKhoaHoc: String,
    IDTheLoaiCap2: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'TheLoaiCap2'
    },
    IDGiangVien: [{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'GiangVien'
    }],
    HocPhiGoc: {
        type:Double,
        min:0
    },
    KhuyenMai: {
        type:Number,
        min:0,
        max:100
    },
    MoTaNgan: String,
    MoTaChiTiet: String,
    NgayDang: {
        type: Date,
        default: new Date()
    },
    CapNhatCuoi: {
        type: Date,
        default: Date.now
    },
    TrangThai: Number,
    AnhDaiDien: String,
    DSHocVien_DanhGia:[{
        idHocVien:ObjectID,
        DiemDanhGia:{
            type:Number,
            min:0,
            max:5
        },
        PhanHoi:String
    }],
    DeCuong:[{
        TenChuong: String,
        DSBaiHoc:[{ 
            TenBaiHoc:String, 
            Video: String
        }]
    }],
    DiemDanhGia:{
        type:Number,
        min:0,
        max:5
    },
    LuotXem:{
        type:Number,
        default:0
    }
}, {collection:'KhoaHoc'})
module.exports = mongoose.model('KhoaHoc', KhoaHocSchema);