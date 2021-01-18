const { Double, ObjectID } = require('bson');
const mongoose = require('mongoose');
const { stringify } = require('querystring');
const Schema = mongoose.Schema;

const KhoaHocSchema = new Schema({
    TenKhoaHoc: String,
    TheLoai2: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'TheLoaiCap2'
    },
    GiangVien: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'GiangVien'
    },
    HocPhiGoc: {
        type:Number,
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
        default: new Date()
    },
    TrangThai: Number,
    AnhDaiDien: {
        type:mongoose.Schema.Types.ObjectId,
        // ref: 'photos.files'
    },
    DSHocVien_DanhGia:[{
        idHocVien:{
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
    }],
    DeCuong:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Chuong'
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
KhoaHocSchema.index({ 'TenKhoaHoc': 'text' });
module.exports = mongoose.model('KhoaHoc', KhoaHocSchema);