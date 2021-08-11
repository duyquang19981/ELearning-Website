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
const bcrypt = require('bcrypt');

route.get('/', async (req,res)=>{
  if (!req.isAuthenticated()){
    res.redirect('/login');
    return; 
}
if(+req.user.Role !=0){
  res.redirect('/');
  return;
}
  const searchkey = req.query.searchkey || "";
  const page = req.query.page || 1;
  const perPage = 10;
  db._connect();
  let data = [];
  var totalPages = 1;
  const admin = await Admin.findOne().lean();
  if(searchkey===""){
    //get all data
    const numberOfData = await GiangVien.find().countDocuments();
    totalPages = parseInt(Math.ceil(+numberOfData / perPage ));
    data = await GiangVien.find().populate('DSKhoaHocDay')
    .skip(perPage*(page-1))
    .limit(perPage)
    .lean();
  }
  else{
    const numberOfData = await GiangVien.find({$text: { $search: searchkey }}).count();
    totalPages = parseInt(Math.ceil(+numberOfData / perPage ));
    data = await GiangVien.find({$text: { $search: searchkey }}).populate('DSKhoaHocDay')
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
  res.render(`admin/giangvien-manage-table`,{
    layout:'admin/a_main',
    tableList : admin.DSBangQL,
    GiangVien : data,
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
if(+req.user.Role !=0a){
  res.redirect('/');
  return;
}
  const {ten,username,mail} = req.body;
  const searchkey = req.query.searchkey || "";
  const page = req.query.page || 1;
  const giangvien = new GiangVien({
    Ten : ten,
    Mail: mail,
    Username : username,
    Password : hashPassword(username),
    DSKhoaHocDay:[]
  });
  db._connect();
  giangvien.save(function (err) {
    if (err) return console.error(err);
    db._disconnect;
    res.redirect(`/admin/manage-table/GiangVien?searchkey=${searchkey}&page=${page}`);
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
  GiangVien.findByIdAndUpdate(_id,{Ten:ten, Mail:mail},function (err) {
    if (err) return console.error(err);
    db._disconnect;
    res.redirect(`/admin/manage-table/GiangVien?searchkey=${searchkey}&page=${page}`);
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
  const _id = req.body._id;
  const searchkey = req.query.searchkey || "";
  const page = req.query.page || 1;
  db._connect();
  const giangvien = await GiangVien.findById(_id); 
  if(+giangvien.DSKhoaHocDay.length===0){
    GiangVien.findByIdAndRemove(_id, function(err){
      console.log('err', err);
    });
  }
  db._disconnect;
  res.redirect(`/admin/manage-table/GiangVien?searchkey=${searchkey}&page=${page}`);
});

route.get('/getnumberofcourse', async(req,res)=>{

  db._connect();
  const _id = req.query._id;
  const data = await GiangVien.findById(_id);
  const numberofcourse = data.DSKhoaHocDay.length;
  db._disconnect();
  res.send({numberofcourse: numberofcourse});
});

route.get('/getcoursesofteacher', async(req,res)=>{
  if (!req.isAuthenticated()){
    res.redirect('/login');
    return; 
}

  const _id = req.query._id;
  db._connect();
  let data ;
  try{
    data = await GiangVien.findById(_id).populate('DSKhoaHocDay','TenKhoaHoc');
  }
  catch(err){
    console.log(err);
    res.send({status:'Failed'});
  }
  
  res.send({status:'Successed',  data:data});
});

route.get('/checkUsernameExist', async(req,res)=>{
  db._connect();
  const username = req.query.username;
  const data1 = await GiangVien.findOne({Username:username}).lean();
  const data2 = await HocVien.findOne({Username:username}).lean();
  db._disconnect();
  if(data1 === null && data2===null){
    res.send({isExist:false});
  }
  else{
    res.send({isExist:true});
  }

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
