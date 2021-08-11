const express = require('express');
const route = express.Router();
const path = require('path');
const bcrypt = require('bcrypt');

// const jwt = require('jsonwebtoken');
const passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;


const db = require('../../utils/db');
const mongoose=require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const bodyParser = require('body-parser');
const Admin = require('../../models/schema/Admin.model');
const KhoaHoc = require('../../models/schema/KhoaHoc.model');
const GiangVien = require('../../models/schema/GiangVien.model');
const HocVien = require('../../models/schema/HocVien.model');
const TheLoaiCap1 = require('../../models/schema/TheLoaiCap1.model');
const TheLoaiCap2  =require('../../models/schema/TheLoaiCap2.model');
const photosfiles = require('../../models/schema/photos.files.model');
const photoschunks = require('../../models/schema/photos.chunks.model');
const fsfiles = require('../../models/schema/fs.files.model');
const fschunks = require('../../models/schema/fs.chunks.model');
const DanhGia = require('../../models/schema/DanhGia.model');
const Chuong = require('../../models/schema/Chuong.model');
const TrangThaiModel = require('../../models/schema/TrangThai.model');

route.get('/', async (req,res )=>{
  if (!req.isAuthenticated()){
        
    res.redirect('/login');
    return; 
  }
  if(+req.user.Role !=2){
    res.redirect('/');
    return;
  }
  const _id =  req.user._id ;
  db._connect();
  const userinfo = await HocVien.findOne({ "_id": _id}).lean();
  const theloai = await TheLoaiCap1.find().populate('TheLoaiCon').lean();
  res.render('user/info', {
    layout: 'user/profile',
    //layout: 'user/profile',
    user: userinfo,
    theloai,
    isAuthentication: req.isAuthenticated(),
  });
});

route.post('/changeinfo',  async (req,res)=>{
  if (!req.isAuthenticated()){
        
    res.redirect('/login');
    return; 
  }
  if(+req.user.Role !=2){
    res.redirect('/');
    return;
  }
  const _id = req.user._id;
  const uTen = req.body.hoten;
  const uMail = req.body.email;
  db._connect();
  HocVien.findByIdAndUpdate(_id,{Ten:uTen,Mail:uMail},function(err){
    if(err){
        res.json({kq:0, ErrMgs:err});
    }else{
        res.redirect('./');
    }
  });
});
route.get('/mycourses', async (req,res)=>{
  if (!req.isAuthenticated()){
        
    res.redirect('/login');
    return; 
  }
  if(+req.user.Role !=2){
    res.redirect('/');
    return;
  } 
  const _id =  req.user._id ;
  const page = req.query.page || 1;
  var perPage = 3;
  
  db._connect();
  let data = [];
  const theloai = await TheLoaiCap1.find().populate('TheLoaiCon').lean();
  const hocvien = await HocVien.findById(_id).populate('DSKhoaHocDK').lean();
  var start = (page - 1 ) * perPage;
  var end = perPage * page;
  var coursesInPage = hocvien.DSKhoaHocDK.slice(start,end);
  const numberOfData = hocvien.DSKhoaHocDK.length;
  totalPages = parseInt(Math.ceil(+numberOfData / perPage ));
  var i=0;
  for (const item of coursesInPage) {
    const data_hinhanh = await photosfiles.findById(item.AnhDaiDien).lean(); 
    const data_chunks = await photoschunks.find({files_id : data_hinhanh._id}).lean();
    if(!data_chunks || data_chunks.length === 0){               
      db._disconnect();      
      return res.send('No data found~');
    }
    let fileData = [];          
    for(let i=0; i<data_chunks.length;i++){                   
      fileData.push(data_chunks[i].data.toString('base64'));          
    }
    //Display the chunks using the data URI format          
    let finalFile = 'data:' + data_hinhanh.contentType + ';base64,' 
          + fileData.join('');  
    coursesInPage[i].AnhDaiDien = finalFile;
    let trangthai = await TrangThaiModel.findOne({HocVien:_id, KhoaHoc:item._id});
    if(trangthai!=null){
      if(+trangthai.TrangThai>10){
        coursesInPage[i].isDone = true;
      }
    }
    i++;
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

  res.render('user/mycourses', {
    layout: 'user/profile',
    usercourses: coursesInPage,
    pages:pages,
    pagesNav : pagesNav,
    user : hocvien,
    theloai,
    isAuthentication: req.isAuthenticated(),
  });

});

route.get('/WatchList',  async (req,res)=>{
  if (!req.isAuthenticated()){
        
    res.redirect('/login');
    return; 
  }
  if(+req.user.Role !=2){
    res.redirect('/');
    return;
  } 
  const _id =  req.user._id ;

  var userCourses = {};
  var pageNumberRequest = req.query.page || 1;
  var perPage = 3;
  
  db._connect();
  const userinfo = await HocVien.findOne({ "_id": _id}).lean();
  const WatchList = await HocVien.findOne({ "_id": _id}).select('WatchList');
  const theloai = await TheLoaiCap1.find().populate('TheLoaiCon').lean();
  const A_WatchList = WatchList.get('WatchList');
  const coursesList = await KhoaHoc.find({'_id':{$in: A_WatchList}}).lean();
  
  let start = (pageNumberRequest - 1 ) * perPage;
  let end = perPage * pageNumberRequest;
  let coursesInPage = coursesList.slice(start,end);
  let totalPage = parseInt(Math.ceil(coursesList.length / perPage));
  const pages = [];       // array of page and status
  
  for (let i = 0; i < totalPage; i++) {
      pages[i] = {
          value : i + 1 ,
          isActive : (i+1) == pageNumberRequest,
      }
  }
  const pagesNav = {};
  if(pageNumberRequest > 1){
      pagesNav.prev = Number(pageNumberRequest) - 1;
  }
  if(pageNumberRequest < totalPage){
      pagesNav.next = Number(pageNumberRequest) + 1;
  }
  var i=0;
  for (const item of coursesInPage) {
    const data_hinhanh = await photosfiles.findById(item.AnhDaiDien).lean(); 
    const data_chunks = await photoschunks.find({files_id : data_hinhanh._id}).lean();
    if(!data_chunks || data_chunks.length === 0){               
      db._disconnect();      
      return res.send('No data found~');
    }
    let fileData = [];          
    for(let i=0; i<data_chunks.length;i++){                   
      fileData.push(data_chunks[i].data.toString('base64'));          
    }
    //Display the chunks using the data URI format          
    let finalFile = 'data:' + data_hinhanh.contentType + ';base64,' 
          + fileData.join('');  
    coursesInPage[i].AnhDaiDien = finalFile;
    i++;   
  }

  res.render('user/WatchList', {
    layout: 'user/profile',
    courses: coursesInPage,
    pages:pages,
    pagesNav : pagesNav,
    user: userinfo,
    theloai,
    isAuthentication: req.isAuthenticated(),
  });

});

route.get('/cart',  async (req,res)=>{
  if (!req.isAuthenticated()){
        
    res.redirect('/login');
    return; 
  }
  if(+req.user.Role !=2){
    res.redirect('/');
    return;
  } 
  const _id =  req.user._id ;

  var userCourses = {};
  var pageNumberRequest = req.query.page || 1;
  var perPage = 8;
  
  db._connect();
  const theloai = await TheLoaiCap1.find().populate('TheLoaiCon').lean();
  const userinfo = await HocVien.findOne({ "_id": _id}).lean();
  const GioHang = await HocVien.findOne({ "_id": _id}).select('GioHang');
  
  const A_GioHang = GioHang.get('GioHang');
  const coursesList = await KhoaHoc.find({'_id':{$in: A_GioHang}}).lean();
  let TongTien =0;
  coursesList.forEach(function(cL) {
    cL.ThanhTien = cL.HocPhiGoc*(1-cL.KhuyenMai/100);
    TongTien = TongTien + cL.ThanhTien
  });
  
  var i=0;
  for (const item of coursesList) {
    const data_hinhanh = await photosfiles.findById(item.AnhDaiDien).lean(); 
    const data_chunks = await photoschunks.find({files_id : data_hinhanh._id}).lean();
    if(!data_chunks || data_chunks.length === 0){               
      db._disconnect();      
      return res.send('No data found~');
    }
    let fileData = [];          
    for(let i=0; i<data_chunks.length;i++){                   
      fileData.push(data_chunks[i].data.toString('base64'));          
    }
    //Display the chunks using the data URI format          
    let finalFile = 'data:' + data_hinhanh.contentType + ';base64,' 
          + fileData.join('');  
          coursesList[i].AnhDaiDien = finalFile;
    i++;   
  }
  let start = (pageNumberRequest - 1 ) * perPage;
  let end = perPage * pageNumberRequest;
  let coursesInPage = coursesList.slice(start,end);
  let totalPage = parseInt(coursesList.length / perPage + 1);;
  const pages = [];       // array of page and status
  
  for (let i = 0; i < totalPage; i++) {
      pages[i] = {
          value : i + 1 ,
          isActive : (i+1) == pageNumberRequest,
      }
  }
  const pagesNav = {};
  if(pageNumberRequest > 1){
      pagesNav.prev = Number(pageNumberRequest) - 1;
  }
  if(pageNumberRequest < totalPage){
      pagesNav.next = Number(pageNumberRequest) + 1;
  }
  db._disconnect();

  res.render('user/Cart', {
    layout: 'user/profile',
    usercart: coursesInPage,
    pages:pages,
    pagesNav : pagesNav,
    user: userinfo,
    theloai,
    totalprice:TongTien,
    isAuthentication: req.isAuthenticated(),
  });

});
const https = require('https');
route.get('/delCourseInCart', async (req,res)=>{
  
  if (!req.isAuthenticated()){
    res.redirect('/login');
    return; 
  }
  db._connect(); 
  const id_user = req.user._id;
  const id_course = req.query.idcourse;
  const userinfo = await HocVien.findOne({ "_id": id_user}).lean();
  var course = await KhoaHoc.findOne({ "_id": id_course}).lean();
  await HocVien.findOneAndUpdate({_id:id_user},{$pull:{GioHang: id_course}}, function(err){
      if(err){
          console.log('err ' + err);
          res.send({status:'Failed',  subtractValue:0});
      }
      else{
          res.send({status:'Successed',  subtractValue:course.Gia});
      }
  });
  
  db._disconnect();
});
//delete WL
route.get('/delCourseInWL', async (req,res)=>{
  
  if (!req.isAuthenticated()){
        
    res.redirect('/login');
    return; 
  }
  db._connect(); 
  const id_user = req.user._id;
  const id_course = req.query.idcourse;
  console.log(id_user);
  await HocVien.findOneAndUpdate({_id:id_user},{$pull:{WatchList: id_course}}, function(err){
      if(err){
          console.log('err' + err);
          res.send({status:'Failed'});
      }
      else{
          res.send({status:'Successed'});
      }
  });
  
  db._disconnect();
});

//add cart and wl
route.get('/addtocart', async (req,res)=>{
  if (!req.isAuthenticated()){    
    res.redirect('/login');
    return; 
  }
  if(+req.user.Role !=2){
    res.redirect('/');
    return;
  }
  db._connect();
  const id_user = req.user._id;
  const khoahoc_id = req.query.khoahoc_id;
  
  const hocvien = await HocVien.findById(id_user);
  for(i of hocvien.GioHang){
    if(i == khoahoc_id){
      res.send('existed');
      db._disconnect();
      return;
    }
  }
  try {
    await HocVien.findByIdAndUpdate(id_user, {$push:{GioHang: khoahoc_id}});
    res.send('successed');
  } catch (error) {
    console.log('err ' + error);
    res.send('failed');
  }
  db._disconnect();
});


route.get('/addtowl', async (req,res)=>{
  if (!req.isAuthenticated()){    
    res.redirect('/login');
    return; 
  }
  if(+req.user.Role !=2){
    res.redirect('/');
    return;
  }
  db._connect();
  const id_user = req.user._id;
  const khoahoc_id = req.query.khoahoc_id;
  const hocvien = await HocVien.findById(id_user);
  for(i of hocvien.WatchList){
    if(i == khoahoc_id){
      res.send('existed');
      db._disconnect();
      return;
    }
  }
  try {
    await HocVien.findByIdAndUpdate(id_user, {$push:{WatchList: khoahoc_id}});
    res.send('successed');
  } catch (error) {
    console.log('err ' + error);
    res.send('failed');
  }
  db._disconnect();
});

route.get('/checkout', async (req,res)=>{
  if (!req.isAuthenticated()){    
    res.redirect('/login');
    return; 
  }
  if(+req.user.Role !=2){
    res.redirect('/');
    return;
  }
  const _id = req.user._id;
  db._connect();
  const user = await HocVien.findById(_id).lean();
  let giohang = user.GioHang;
  let DSKhoaHocDK = user.DSKhoaHocDK.concat(giohang);
  //if exist
  DSKhoaHocDK = Array.from(new Set(DSKhoaHocDK));
  giohang = []
  try{
    await HocVien.findByIdAndUpdate(_id,{
      GioHang : [],
      DSKhoaHocDK : DSKhoaHocDK
    })
  } catch(err){
    console.log('err :>> ', err);
  }
  res.redirect('/user/profile/cart');
  db._disconnect();
  
});

module.exports = route;
