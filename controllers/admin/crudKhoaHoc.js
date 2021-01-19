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
  if (!req.isAuthenticated()){
    res.redirect('/login');
    return; 
  }
  if(+req.user.Role !=0){
    res.redirect('/');
    return;
  }
  console.log('khoa hoc');
  const searchkey = req.query.searchkey || "";
  const page = req.query.page || 1;
  const perPage = 10;
  db._connect();
  let data = [];
  const admin = await Admin.findOne().lean();
  if(searchkey===""){
    const numberOfData = await KhoaHoc.find().countDocuments();
    totalPages = parseInt(Math.ceil(+numberOfData / perPage ));
    data = await KhoaHoc.find().populate('GiangVien', 'Ten').populate('TheLoai2','TenTheLoai')
    .skip(perPage*(page-1))
    .limit(perPage)
    .lean();
  }
  else{
    const numberOfData = await KhoaHoc.find({$text: { $search: searchkey }}).count();
    totalPages = parseInt(Math.ceil(+numberOfData / perPage ));
    data = await KhoaHoc.find({$text: { $search: searchkey }}).populate('GiangVien', 'Ten').populate('TheLoai2','TenTheLoai')
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
  res.render(`admin/khoahoc-manage-table`,{
    layout:'admin/a_main',
    tableList : admin.DSBangQL,
    KhoaHoc : data,
    searchkey : searchkey,
    page : page,
    pages : pages,
    pagesNav : pagesNav
    });
  db._disconnect();
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
  console.log('del khoa hoc');
  const _id = req.body._id;
  const id_theloai = req.body.id_theloai;
  const searchkey = req.query.searchkey || "";
  const page = req.query.page || 1;
  db._connect();
  const khoahoc = KhoaHoc.findByIdAndRemove(_id,function (err) {
    if (err) return console.error(err);
    console.log(" delete KhoaHoc collection.");
  });
  //
  const theloai2 = await TheLoaiCap2.findById(id_theloai);
  await TheLoaiCap2.findByIdAndUpdate(id_theloai,{SoKhoaHoc:+theloai2.SoKhoaHoc - 1});
  console.log('cap nhat so khoa hoc 2');
  await TheLoaiCap2.findByIdAndUpdate(id_theloai, {$pull:{DSKhoaHoc:khoahoc._id}});
  console.log('xoa khoa hoc khoi ds the loai');
  const theloai1 = await TheLoaiCap1.find();
  var temp;
  for (const item of theloai1) {
    var found = item.TheLoaiCon.indexOf(theloai2._id);

    if(found>=0){

      temp = item;
      break;
    }
  }
  await TheLoaiCap1.findByIdAndUpdate(temp._id,{SoKhoaHoc : +temp.SoKhoaHoc - 1});
  console.log('cap nhat so luong khoa hoc -1');
  db._disconnect();
  console.log('xoa khoa hoc xong');
  db._disconnect;
  res.redirect(`/admin/manage-table/KhoaHoc?searchkey=${searchkey}&page=${page}`);
});


module.exports = route;
