const  express = require('express');
const route = express.Router();
const db = require('../../utils/db');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Admin = require('../../models/schema/Admin.model');
const KhoaHoc = require('../../models/schema/KhoaHoc.model');
const GiangVien = require('../../models/schema/GiangVien.model');
const HocVien = require('../../models/schema/HocVien.model');
const TheLoaiCap1 = require('../../models/schema/TheLoaiCap1.model');
const TheLoaiCap2  =require('../../models/schema/TheLoaiCap2.model');
const ThongKe = require('../../models/schema/ThongKe.model');
const { validate } = require('../../models/schema/Admin.model');
const _id = '5ffa03261194ed6e97dc81f4';
route.get('/', async (req,res )=>{
  console.log('go to profile');

  db._connect();
  const info =await HocVien.findOne({ "_id": _id}).lean();
  // console.log(info);
  res.render('user/info', {
    layout: 'user/profile',
    userinfo:info,
  });
});
route.post('/changeinfo', async (req,res)=>{
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
  console.log("go to profile/mycourses")
  var userCourses = {};
  var pageNumberRequest = req.query.page || 1;
  var perPage = 3;
  
  db._connect();
  const info = await HocVien.findOne({ "_id": _id}).lean();
  const DSKhoaHocDK = await HocVien.findOne({ "_id": _id}).select('DSKhoaHocDK.KhoaHoc');
  const mycourses = DSKhoaHocDK.get('DSKhoaHocDK');
  let A_mycourses = mycourses.map(x=>x.KhoaHoc);
  const coursesList = await KhoaHoc.find({'_id':{$in: A_mycourses}}).lean();
  console.log(coursesList);

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
    userinfo:info,
  });

});
module.exports = route;
