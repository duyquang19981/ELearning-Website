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
    data = await KhoaHoc.find()
    .skip(perPage*(page-1))
    .limit(perPage)
    .lean();
  }
  else{
    const numberOfData = await KhoaHoc.find({$text: { $search: searchkey }}).count();
    totalPages = parseInt(Math.ceil(+numberOfData / perPage ));
    data = await KhoaHoc.find({$text: { $search: searchkey }})
    .skip(perPage*(page-1))
    .limit(perPage)
    .lean();
  }
  // const data1 = new KhoaHoc({
  // // _id: "123123eqqwqwdqwdid",
  //   TenKhoaHoc: "day la ten3",
  //   //TheLoai2:{
  //     // _id:'id the loai 2',
  //     //TenTheLoai: 'Day la ten the loai 2'
  //   //},
  //   //GiangVien : {
  //     // _id:'id giang vien',
  //     //Ten: 'Day la ten giang vien'
  //   //},
  //   HocPhiGoc: 10000,
  //   KhuyenMai: 22,
  //   MoTaNgan: 'Day la mot ta ngan',
  //   MoTaChiTiet: 'Day la mot ta chi tiet',
  //   NgayDang : new Date(),
  //   CapNhatCuoi: new Date(),
  //   TrangThai: 0,
  //   AnhDaiDien: 'link anh dai dien',
  //   DSHocVien_DanhGia: [],
  //   DeCuong:[],
  //   DiemDanhGia: 5,
  //   LuotXem: 200
  // }
  // );
  // const data2 = new KhoaHoc(
  //   {
  //     // _id: "123123eqqw1232qwdqwdid",
  //     TenKhoaHoc: "day la ten2",
  //     //TheLoai2:
  //     //{
  //       // _id:'id the loai 2',
  //       //TenTheLoai: 'Day la ten the lo1e12eai3'
  //     //},
  //     //GiangVien: 
  //     //{
  //       // _id:'id giang vien',
  //       //Ten: 'Day la ten giang vien 2123123'
  //     //},
  //     HocPhiGoc: 10000,
  //     KhuyenMai: 22,
  //     MoTaNgan: 'Day la mot ta ngan123123',
  //     MoTaChiTiet: 'Day la mot ta chi tiet12312321',
  //     NgayDang : new Date().toUTCString(),
  //     CapNhatCuoi: new Date().toUTCString(),
  //     TrangThai: 0,
  //     AnhDaiDien: 'link anh dai dien12312321',
  //     DSHocVien_DanhGia: [],
  //     DeCuong:[],
  //     DiemDanhGia: 5,
  //     LuotXem: 200
  //   });
  // try {
  //   await data1.save();
  //   await data2.save();
    
  //   console.log('Save date to KhoaHoc');
  // } catch (error) {
  //   console.log('error :>> ', error);
  // }
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
  console.log('del khoa hoc');
  const _id = req.body._id;
  const searchkey = req.query.searchkey || "";
  const page = req.query.page || 1;
  db._connect();
  KhoaHoc.findByIdAndRemove(_id,function (err) {
    if (err) return console.error(err);
    console.log(" delete KhoaHoc collection.");
  });
  db._disconnect;
  res.redirect(`/admin/manage-table/KhoaHoc?searchkey=${searchkey}&page=${page}`);
});


module.exports = route;
