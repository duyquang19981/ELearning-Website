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


route.post('/add', async (req,res)=>{
  const TenTheLoai = req.body.tentheloai;
  console.log('TenTheLoai :>> ',TenTheLoai);
  const theloai = new TheLoaiCap1({
    TenTheLoai : TenTheLoai,
    TheLoaiCon :[],
    DS5KhoaMuaNhieu:[],
    SoKhoaHoc:0,
  });
  db._connect();
  theloai.save(function (err) {
    if (err) return console.error(err);
    console.log(" saved to TheLoaiCap1 collection.");
  });
  db._disconnect;
  res.redirect('/admin/manage-table/3');
});

route.post('/edit', async (req,res )=>{
  const TenTheLoai = req.body.tentheloai;
  const _id = req.body._id;
  db._connect();
  TheLoaiCap1.findByIdAndUpdate(_id,{TenTheLoai:TenTheLoai},function (err) {
    if (err) return console.error(err);
    console.log(" edit TheLoaiCap1 collection.");
  });

  db._disconnect;
  res.redirect('/admin/manage-table/3');
});


module.exports = route;
