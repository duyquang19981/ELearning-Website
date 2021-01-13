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
const TheLoaiCap1Model = require('../../models/schema/TheLoaiCap1.model');

route.get('/', async (req,res)=>{
  console.log('the loai1');
  db._connect();
  const admin = await Admin.findOne().lean();
  const TheLoai1 = await TheLoaiCap1.find().populate('TheLoaiCon').lean();
  res.render(`admin/theloai1-manage-table`,{
    layout:'admin/a_main',
    tableList : admin.DSBangQL,
    TheLoai1 : TheLoai1
    });
  db._disconnect();
}); 

route.post('/add1', async (req,res)=>{
  const TenTheLoai = req.body.tentheloai;
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
    db._disconnect;
    res.redirect('/admin/manage-table/TheLoai');
  });
});

route.post('/edit1', async (req,res )=>{
  const TenTheLoai = req.body.tentheloai;
  const _id = req.body._id;
  db._connect();
  TheLoaiCap1.findByIdAndUpdate(_id,{TenTheLoai:TenTheLoai},function (err) {
    if (err) return console.error(err);
    console.log(" edit TheLoaiCap1 collection.");
    
    db._disconnect;
    res.redirect('/admin/manage-table/TheLoai');
  });

});

route.post('/delete1', async (req,res )=>{
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

// sub category


route.post('/add2', async (req,res)=>{
  const TenTheLoai = req.body.tentheloai;
  const parent_id = req.body.parent_id;
  const theloai2 = new TheLoaiCap2({
    TenTheLoai : TenTheLoai,
    DSKhoaHoc:[],
    SoKhoaHoc:0,
  });
  db._connect();
  await theloai2.save();
  await TheLoaiCap1.findByIdAndUpdate(parent_id, {$push:{TheLoaiCon:theloai2._id}});
  db._disconnect;
  res.redirect('/admin/manage-table/TheLoai');
});


route.post('/edit2', async (req,res )=>{
  const TenTheLoai = req.body.tentheloai;
  const {_id} = req.body;
  db._connect();
  TheLoaiCap2.findByIdAndUpdate(_id,{TenTheLoai:TenTheLoai},function (err) {
    if (err) return console.error(err);
    console.log(" edit TheLoaiCap2 collection.");
    db._disconnect;
    res.redirect('/admin/manage-table/TheLoai');
  });

});

route.post('/delete2', async (req,res )=>{
  const {_id} = req.body;
  const parent_id = req.body.parent_id;
  db._connect();
  const TheLoai2 = await TheLoaiCap2.findById(_id); 
  if(+TheLoai2.SoKhoaHoc===0){
    await TheLoaiCap2.findByIdAndRemove(_id);
    await TheLoaiCap1.findByIdAndUpdate(parent_id,{$pull:{TheLoaiCon:_id}});
  }
  db._disconnect;
  res.redirect('/admin/manage-table/TheLoai');
});

module.exports = route;
