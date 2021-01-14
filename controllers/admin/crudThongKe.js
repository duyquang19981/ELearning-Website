const  express = require('express');
const route = express.Router();
const db = require('../../utils/db');
const mongoose = require('mongoose');
const Admin = require('../../models/schema/Admin.model');
const KhoaHoc = require('../../models/schema/KhoaHoc.model');
const GiangVien = require('../../models/schema/GiangVien.model');
const HocVien = require('../../models/schema/HocVien.model');
const TheLoaiCap1 = require('../../models/schema/TheLoaiCap1.model');
const TheLoaiCap2  =require('../../models/schema/TheLoaiCap2.model');
const ThongKe = require('../../models/schema/ThongKe.model');
const TheLoaiCap1Model = require('../../models/schema/TheLoaiCap1.model');



route.get('/', async (req,res)=>{
  console.log('thong ke');
  // db._connect();
  // const admin = await Admin.findOne().lean();
  // const data = await ThongKe.findOne().lean();
  // const KhoaHocNoiBat = data.KhoaHocNoiBat;
  // const KhoaHocXemNhieu = data.KhoaHocXemNhieu;
  // res.render(`admin/thongke-manage-table`,{
  //   layout:'admin/a_main',
  //   tableList : admin.DSBangQL,
  //   KhoaHoc : data
  //   });
  // db._disconnect();
});

route.post('/delete', async (req,res )=>{
  console.log('del khoa hoc');
  const _id = req.body._id;
  db._connect();
  KhoaHoc.findByIdAndRemove(_id,function (err) {
    if (err) return console.error(err);
    console.log(" delete KhoaHoc collection.");
  });
  db._disconnect;
  res.redirect('/admin/manage-table/KhoaHoc');
});


module.exports = route;
