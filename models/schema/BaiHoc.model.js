
const { Double, ObjectID } = require('bson');
const mongoose = require('mongoose');
const { stringify } = require('querystring');
const Schema = mongoose.Schema;

const BaiHocSchema = new Schema({
  TenBaiHoc:String, 
  Video:{ type: mongoose.Schema.Types.ObjectID}
}, {collection:'BaiHoc'});
module.exports = mongoose.model('BaiHoc', BaiHocSchema);