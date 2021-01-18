const  express = require('express');
const route = express.Router();
const db = require('../../utils/db');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Admin = require('../../models/schema/Admin.model');
const KhoaHoc = require('../../models/schema/KhoaHoc.model');
const GiangVien = require('../../models/schema/GiangVien.model');
const HocVien = require('../../models/schema/HocVien.model');
const TheLoaiCap1 = require('../../models/schema/TheLoaiCap1.model');
const TheLoaiCap2  =require('../../models/schema/TheLoaiCap2.model');
const TheLoaiCap1Model = require('../../models/schema/TheLoaiCap1.model');

route.get('/', async (req,res)=>{
  if (!req.isAuthenticated()){
    res.redirect('/login');
    return; 
}
if(+req.user.Role !=0){
  res.redirect('/');
  return;
}
  console.log('hoc vien table');
  const searchkey = req.query.searchkey || "";
  const page = req.query.page || 1;
  const perPage = 10;
  db._connect();
  let data = [];
  var totalPages = 1;
  const admin = await Admin.findOne().lean();
  if(searchkey===""){     
    //get all data
    const numberOfData = await HocVien.find().countDocuments();
    totalPages = parseInt(Math.ceil(+numberOfData / perPage ));
    data = await HocVien.find()
    .skip(perPage*(page-1))
    .limit(perPage)
    .lean();
  }
  else{
    const numberOfData = await HocVien.find({$text: { $search: searchkey }}).count();
    totalPages = parseInt(Math.ceil(+numberOfData / perPage ));
    data = await HocVien.find({$text: { $search: searchkey }})
    .skip(perPage*(page-1))
    .limit(perPage)
    .lean();
  }
  const pages = [];       // array of page and status
  for (let i = 0; i < totalPages; i++) {
      pages[i] = {
          value : i + 1 ,
          isActive : (i+1) == page,
      }
  }
  const pagesNav = {};
  if(page > 1){
      pagesNav.prev = Number(page) - 1;
  }
  if(page < totalPages){
      pagesNav.next = Number(page) + 1;
  }
  res.render(`admin/hocvien-manage-table`,{
    layout:'admin/a_main',
    tableList : admin.DSBangQL,
    HocVien : data,
    searchkey : searchkey,
    page : page,
    pages : pages,
    pagesNav : pagesNav
    });
  db._disconnect();
}); 

route.post('/add', async (req,res)=>{
  if (!req.isAuthenticated()){
    res.redirect('/login');
    return; 
}
if(+req.user.Role !=0){
  res.redirect('/');
  return;
}
  const {ten,username,mail} = req.body;
  const searchkey = req.query.searchkey || "";
  const page = req.query.page || 1;
  const hocvien = new HocVien({
    Ten : ten,
    Mail: mail,
    Username : username,
    Password : hashPassword(username),
    DSKhoaHocDK: [],
    WatchList : [],
    GioHang : []
  });
  db._connect();
  hocvien.save(function (err) {
    if (err) return console.error(err);
    console.log(" saved to Hoc vien collection.");
    db._disconnect;
    res.redirect(`/admin/manage-table/HocVien?searchkey=${searchkey}&page=${page}`);
  });
});

route.post('/edit', async (req,res )=>{
  if (!req.isAuthenticated()){
    res.redirect('/login');
    return; 
}
if(+req.user.Role !=0){
  res.redirect('/');
  return;
}
  const {_id, ten, mail} = req.body;
  const searchkey = req.query.searchkey || "";
  const page = req.query.page || 1;
  db._connect();
  HocVien.findByIdAndUpdate(_id,{Ten:ten, Mail:mail},function (err) {
    if (err) return console.error(err);
    console.log(" edit HocVien collection.");
    db._disconnect;
    res.redirect(`/admin/manage-table/HocVien?searchkey=${searchkey}&page=${page}`);
  });

});

route.post('/delete', async (req,res )=>{
  if (!req.isAuthenticated()){
    res.redirect('/login');
    return; 
}
if(+req.user.Role !=0){
  res.redirect('/');
  return;
}
  console.log('del hoc vien');
  const _id = req.body._id;
  const searchkey = req.query.searchkey || "";
  const page = req.query.page || 1;
  db._connect();

  HocVien.findByIdAndRemove(_id, function(err){
    console.log('err', err);
  });
  
  db._disconnect;
  res.redirect(`/admin/manage-table/HocVien?searchkey=${searchkey}&page=${page}`);
});

route.get('/getcoursesofstudent', async(req,res)=>{
  if (!req.isAuthenticated()){
    res.redirect('/login');
    return; 
}
if(+req.user.Role !=0){
  res.redirect('/');
  return;
}
  console.log('get course of student');
  const _id = req.query._id;
  db._connect();
  let data ;
  try{
    data = await HocVien.findById(_id).populate('KhoaHoc','TenKhoaHoc');
  }
  catch(err){
    console.log(err);
    res.send({status:'Failed'});
  }
  res.send({status:'Successed',  data:data});
});
const hashPassword = (myPassword) => {
  const SALT_HASH = 10;
  const hash = bcrypt.hashSync(myPassword, SALT_HASH);
  return hash;
}

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
res.redirect('/Login/');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
}
module.exports = route;
