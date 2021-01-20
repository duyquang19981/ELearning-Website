const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TrangThaiSchema = new Schema({
  HocVien : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HocVien'
  },
  KhoaHoc: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KhoaHoc'
  },
  TrangThai: Number


}, {collection:'TrangThai'});
module.exports = mongoose.model('TrangThai', TrangThaiSchema);