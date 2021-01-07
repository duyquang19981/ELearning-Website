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
  console.log('hoc vien table');
  db._connect();
  const admin = await Admin.findOne().lean();
  const data = await HocVien.find().lean();
  
  res.render(`admin/hocvien-manage-table`,{
    layout:'admin/a_main',
    tableList : admin.DSBangQL,
    HocVien : data
    });
  db._disconnect();
}); 

route.post('/add', async (req,res)=>{
  const {ten,username,mail} = req.body;
  console.log('ten :>> ', ten);
  console.log('username :>> ', username);
  console.log('email :>> ', mail);

  const hocvien = new HocVien({
    Ten : ten,
    Mail: mail,
    Username : username,
    Password : username,
    DSKhoaHocDK: [],
    WatchList : [],
    GioHang : []
  });
  db._connect();
  hocvien.save(function (err) {
    if (err) return console.error(err);
    console.log(" saved to Hoc vien collection.");
    db._disconnect;
    res.redirect('/admin/manage-table/HocVien');
  });
});

route.post('/edit', async (req,res )=>{
  const {_id, ten, mail} = req.body;
  console.log('_id ne :>> ', _id);
  db._connect();
  HocVien.findByIdAndUpdate(_id,{Ten:ten, Mail:mail},function (err) {
    if (err) return console.error(err);
    console.log(" edit HocVien collection.");
    db._disconnect;
    res.redirect('/admin/manage-table/HocVien');
  });

});

route.post('/delete', async (req,res )=>{
  console.log('del hoc vien');
  const _id = req.body._id;
  db._connect();

  HocVien.findByIdAndRemove(_id, function(err){
    console.log('err', err);
  });
  
  db._disconnect;
  res.redirect('/admin/manage-table/HocVien');
});

route.get('/getcoursesofstudent', async(req,res)=>{
  console.log('get course of student');
  const _id = req.query._id;
  console.log('_id :>> ', _id);
  db._connect();
  let data ;
  try{
    data = await HocVien.findById(_id).populate('KhoaHoc','TenKhoaHoc');
  }
  catch(err){
    console.log(err);
    res.send({status:'Failed'});
  }
  
  console.log('data :>> ', data);
  res.send({status:'Successed',  data:data});
});

module.exports = route;
