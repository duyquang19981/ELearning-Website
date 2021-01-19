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
const DanhGia = require('../../models/schema/DanhGia.model');
const Chuong = require('../../models/schema/Chuong.model');

// const _id = '5ffa03261194ed6e97dc81f4';
route.get('/', async (req,res )=>{
  if (!req.isAuthenticated()){
        
    res.redirect('/login');
    return; 
  }
  const _id =  req.user._id ;
  console.log('go to profile');
  db._connect();
  const userinfo = await HocVien.findOne({ "_id": _id}).lean();
  // console.log(info);
  res.render('user/info', {
    layout: 'user/profile',
    userinfo: userinfo,
    isAuthentication: req.isAuthenticated(),
  });
});

route.post('/changeinfo',  async (req,res)=>{


  const uTen = req.body.hoten;
  const uMail = req.body.email;
  // console.log(Ten);
  // console.log(Mail);
  // console.log(_id);
  db._connect();
  // const hocvien = await HocVien.findById(_id)
  // console.log('hoc vien', hocvien);
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
  const _id =  req.user._id ;


  console.log("go to profile/mycourses")
  var userCourses = {};
  var pageNumberRequest = req.query.page || 1;
  var perPage = 3;
  
  db._connect();
  const userinfo = await HocVien.findOne({ "_id": _id}).lean();
  const DSKhoaHocDK = await HocVien.findOne({ "_id": _id}).select('DSKhoaHocDK.KhoaHoc');
  const mycourses = DSKhoaHocDK.get('DSKhoaHocDK');
  let A_mycourses = mycourses.map(x=>x.KhoaHoc);
  const coursesList = await KhoaHoc.find({'_id':{$in: A_mycourses}}).lean();
  //console.log(coursesList);

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


  res.render('user/mycourses', {
    layout: 'user/profile',
    usercourses: coursesInPage,
    pages:pages,
    pagesNav : pagesNav,
    userinfo:userinfo,
    isAuthentication: req.isAuthenticated(),
  });

});

route.get('/WatchList',  async (req,res)=>{
  if (!req.isAuthenticated()){
        
    res.redirect('/login');
    return; 
  }
  const _id =  req.user._id ;

  console.log("go to profile/WatchList")
  var userCourses = {};
  var pageNumberRequest = req.query.page || 1;
  var perPage = 3;
  
  db._connect();
  const userinfo = await HocVien.findOne({ "_id": _id}).lean();
  const WatchList = await HocVien.findOne({ "_id": _id}).select('WatchList');
  
  const A_WatchList = WatchList.get('WatchList');
  //console.log(A_WatchList);
  // let A_mycourses = mycourses.map(x=>x.KhoaHoc);
  const coursesList = await KhoaHoc.find({'_id':{$in: A_WatchList}}).lean();
  //console.log(coursesList);

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


  res.render('user/WatchList', {
    layout: 'user/profile',
    courses: coursesInPage,
    pages:pages,
    pagesNav : pagesNav,
    userinfo: userinfo,
    isAuthentication: req.isAuthenticated(),
  });

});

route.get('/cart',  async (req,res)=>{
  if (!req.isAuthenticated()){
        
    res.redirect('/login');
    return; 
  }
  const _id =  req.user._id ;

  console.log("go to profile/cart");
  //console.log (_id);
  var userCourses = {};
  var pageNumberRequest = req.query.page || 1;
  var perPage = 8;
  
  db._connect();
  const userinfo = await HocVien.findOne({ "_id": _id}).lean();
  const GioHang = await HocVien.findOne({ "_id": _id}).select('GioHang');
  
  const A_GioHang = GioHang.get('GioHang');
  //console.log(A_GioHang);
  // let A_mycourses = mycourses.map(x=>x.KhoaHoc);
  const coursesList = await KhoaHoc.find({'_id':{$in: A_GioHang}}).lean();
  let TongTien =0;
  coursesList.forEach(function(cL) {
    cL.ThanhTien = cL.HocPhiGoc*(1-cL.KhuyenMai/100);
    TongTien = TongTien + cL.ThanhTien
  });
  //console.log(coursesList);

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


  res.render('user/Cart', {
    layout: 'user/profile',
    usercart: coursesInPage,
    pages:pages,
    pagesNav : pagesNav,
    userinfo: userinfo,
    totalprice:TongTien,
    isAuthentication: req.isAuthenticated(),
  });

});
const https = require('https');
route.get('/delCourse', async (req,res)=>{
  db._connect(); 
  if (!req.isAuthenticated()){
        
    res.redirect('/login');
    return; 
  }
  console.log('go to delCourse');
  const id_user = req.user._id;
  const id_course = req.query.idcourse;
  const userinfo = await HocVien.findOne({ "_id": id_user}).lean();
  var course = await KhoaHoc.findOne({ "_id": id_course}).lean();
  HocVien.findOneAndUpdate({_id:id_user},{$pull:{GioHang: id_course}}, function(err){
      if(err){
          console.log('err' + err);
          res.send({status:'Failed',  subtractValue:0});
      }
      else{
          console.log('removed ');   
          res.send({status:'Successed',  subtractValue:course.Gia});
      }
  });
  
  db._disconnect();
});



module.exports = route;
