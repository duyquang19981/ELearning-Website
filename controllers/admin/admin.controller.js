const  express = require('express');
const route = express.Router();
const db = require('../../utils/db');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const bodyParser = require('body-parser');
const Admin = require('../../models/schema/Admin.model');
const KhoaHoc = require('../../models/schema/KhoaHoc.model');
const GiangVien = require('../../models/schema/GiangVien.model');
const HocVien = require('../../models/schema/HocVien.model');
const TheLoaiCap1 = require('../../models/schema/TheLoaiCap1.model');
const TheLoaiCap2  =require('../../models/schema/TheLoaiCap2.model');

const crudTheLoai = require('./crudTheLoai');
const crudKhoaHoc = require('./crudKhoaHoc');
const crudGiangVien = require('./crudGiangVien');
const crudHocVien = require('./crudHocVien');

route.get('/', async (req,res )=>{
  console.log('go to admin');
  if (!req.isAuthenticated()){
    res.redirect('/login');
    return; 
}
if(+req.user.Role !=0){
  res.redirect('/');
  return;
}
  db._connect();
  // const admin = new Admin({
    // Username : 'admin',
    // DSBangQL : [
    //   {TenBang: 'Khóa học'},
    //   {TenBang: 'Giảng viên'},
    //   {TenBang: 'Học viên'},
    //   {TenBang: 'Thể loại'},
    //   {TenBang: 'Thống kê'},
    // ]
  // });
  // await admin.save();
  const admin = await Admin.findOne().lean();
  res.render('admin/dashboard',{
    layout:'admin/a_main',
    tableList : admin.DSBangQL,
  });
});

route.get('/manage-table',  (req,res)=>{
  console.log('manaage');
  if (!req.isAuthenticated()){
    res.redirect('/login');
    return; 
}
if(+req.user.Role !=0){
  res.redirect('/');
  return;
}
  const index = +req.query.index;
  switch (index) {
    case 0:
      // TheLoai1 = await KhoaHoc.find().lean();
      //render_view = 'khoahoc-manage-table'
      console.log('khoa hoc');
      res.redirect('/admin/manage-table/KhoaHoc');
      break;
    case 1:
      // TheLoai1 = await GiangVien.find().lean();
      //render_view = 'giangvien-manage-table'
      console.log('giang vien');
      res.redirect('/admin/manage-table/GiangVien');
      break;
    case 2:
      // TheLoai1 = await HocVien.find().lean();
      //render_view = 'hocvien-manage-table'
      console.log('hoc vien');
      res.redirect('/admin/manage-table/HocVien');
      break; 
    case 3:
      console.log('the loai');
      res.redirect('/admin/manage-table/TheLoai');
      break;
    case 4:
      console.log('tyhong ke case');
      res.redirect('/admin/manage-table/ThongKe');
      break; 
  
    default:

      render_view = '123';
      break;
  }
  
});

route.get('/logout', (req, res) => {
  console.log('log out teacjer');
  req.logout();
  res.redirect('/');
});

route.use('/manage-table/TheLoai', crudTheLoai);
route.use('/manage-table/KhoaHoc', crudKhoaHoc);
route.use('/manage-table/GiangVien', crudGiangVien);
route.use('/manage-table/HocVien', crudHocVien);

module.exports = route;
