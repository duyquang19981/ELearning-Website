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
  console.log('giang vien table');
  db._connect();
  const admin = await Admin.findOne().lean();
  const data = await GiangVien.find().lean();
  
  res.render(`admin/giangvien-manage-table`,{
    layout:'admin/a_main',
    tableList : admin.DSBangQL,
    GiangVien : data
    });
  db._disconnect();
}); 

route.post('/add', async (req,res)=>{
  const {ten,username,mail} = req.body;
  console.log('ten :>> ', ten);
  console.log('username :>> ', username);
  console.log('email :>> ', mail);

  const giangvien = new GiangVien({
    Ten : ten,
    Mail: mail,
    Username : username,
    Password : username,
    DSKhoaHocDay:[]
  });
  db._connect();
  giangvien.save(function (err) {
    if (err) return console.error(err);
    console.log(" saved to GiangVien collection.");
    db._disconnect;
    res.redirect('/admin/manage-table/GiangVien');
  });
});

route.post('/edit', async (req,res )=>{
  const {_id, ten, mail} = req.body;
  console.log('_id ne :>> ', _id);
  db._connect();
  GiangVien.findByIdAndUpdate(_id,{Ten:ten, Mail:mail},function (err) {
    if (err) return console.error(err);
    console.log(" edit GiangVien collection.");
    
    db._disconnect;
    res.redirect('/admin/manage-table/GiangVien');
  });

});

route.post('/delete', async (req,res )=>{
  console.log('del1');
  const _id = req.body._id;
  db._connect();
  const TheLoai1 = await TheLoaiCap1.findById(_id); 
  if(+TheLoai1.SoKhoaHoc===0){
    TheLoaiCap1.findByIdAndRemove(_id,function (err) {
      if (err) return console.error(err);
      console.log(" delete TheLoaiCap1 collection.");
    });
  }
  
  db._disconnect;

  res.redirect('/admin/manage-table/TheLoai');
});


module.exports = route;
