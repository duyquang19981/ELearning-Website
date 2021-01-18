const { Double, ObjectID } = require('bson');
const mongoose = require('mongoose');
const { stringify } = require('querystring');
const Schema = mongoose.Schema;

const ChuongSchema = new Schema({
    TenChuong: String,
    beLongTo : {
        type: mongoose.Schema.Types.ObjectID,
        ref:'KhoaHoc'
    },
    DSBaiHoc:[{ 
        type: mongoose.Schema.Types.ObjectID,
        ref:'BaiHoc'
        
    }]
}, {collection:'Chuong'});
module.exports = mongoose.model('Chuong', ChuongSchema);