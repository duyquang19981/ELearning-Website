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

route.get('/', async (req,res )=>{
  console.log('go to admin');
  db._connect();
  // const admin = new Admin({
  //   Username : 'admin',
  //   DSBangQL : [
  //     {TenBang: 'Khóa học'},
  //     {TenBang: 'Giảng viên'},
  //     {TenBang: 'Học viên'},
  //     {TenBang: 'Thể loại'},
  //     {TenBang: 'Thống kê'},
  //   ]
  // });
  // await admin.save();
  const admin = await Admin.findOne().lean();
  console.log('admin :>> ', admin);
  console.log('admin.DSBangQL :>> ', admin.DSBangQL);
  
  res.render('admin/dashboard',{
    layout:'admin/a_main',
    tableList : admin.DSBangQL,
  });
});

route.get('/manage-table/:index', async (req,res)=>{
  db._connect();
  const index = +req.params.index;
  console.log('index :>> ', index);
  const admin = await Admin.findOne().lean();
  console.log('tableNames :>> ', admin);
  let tableName = admin.DSBangQL[index].TenBang;
  let result, render_view;

  switch (index) {
    case 0:
      result = await KhoaHoc.find().lean();
      render_view = 'khoahoc-manage-table'
      break;
    case 1:
      result = await GiangVien.find().lean();
      render_view = 'giangvien-manage-table'
      break;
    case 2:
      result = await HocVien.find().lean();
      render_view = 'hocvien-manage-table'
      break; 
    case 3:
      result = await TheLoaiCap1.find().lean();
      render_view = 'theloai1-manage-table'
      break;
    case 4:
      result = await ThongKe.find().lean();
      render_view = 'thongke-manage-table'
      break; 
  
    default:
      result = null;
      render_view = '123';
      break;
  }
  console.log('result :>> ', result);
  console.log('tableName :>> ', tableName);
  console.log('render_view :>> ', render_view);
  res.render(`admin/${render_view}`,{
    layout:'admin/a_main',
    tableList : admin.DSBangQL,
  });
  db._disconnect();
})


module.exports = route;
