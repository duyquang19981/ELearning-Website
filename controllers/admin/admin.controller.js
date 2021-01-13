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
const ThongKe = require('../../models/schema/ThongKe.model');
const crudTheLoai = require('./crudTheLoai');
const crudKhoaHoc = require('./crudKhoaHoc');
const crudGiangVien = require('./crudGiangVien');
const crudHocVien = require('./crudHocVien');
const crudThongKe = require('./crudThongKe');

route.get('/', async (req,res )=>{
  console.log('go to admin');
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


// route.get('/manage-table/:index', async (req,res)=>{
//   db._connect();
//   const index = +req.params.index;
//   const admin = await Admin.findOne().lean();
//   let tableName = admin.DSBangQL[index].TenBang;
//   let TheLoai1, render_view;

//   switch (index) {
//     case 0:
//       TheLoai1 = await KhoaHoc.find().lean();
//       render_view = 'khoahoc-manage-table'
//       break;
//     case 1:
//       TheLoai1 = await GiangVien.find().lean();
//       render_view = 'giangvien-manage-table'
//       break;
//     case 2:
//       TheLoai1 = await HocVien.find().lean();
//       render_view = 'hocvien-manage-table'
//       break; 
//     case 3:
//       TheLoai1 = await TheLoaiCap1.find().lean();
//       render_view = 'theloai1-manage-table'
//       break;
//     case 4:
//       TheLoai1 = await ThongKe.find().lean();
//       render_view = 'thongke-manage-table'
//       break; 
  
//     default:

//       render_view = '123';
//       break;
//   }
//   // result = [
//   //   {_id: '1fasfs', TenTheLoai:'Mang may tinh', SoKhoaHoc:10},
//   //   {_id: '12fasfwfw', TenTheLoai:'Mang12h', SoKhoaHoc:10},
//   //   {_id: '1àasdwfqwf', TenTheLoai:'Mang 124inh', SoKhoaHoc:12},
//   //   {_id: '1qưeqwr3r3t', TenTheLoai:'Mang m124tinh', SoKhoaHoc:140},
//   // ];
//   console.log('render_view :>> ', render_view);
//   res.render(`admin/${render_view}`,{
//     layout:'admin/a_main',
//     tableList : admin.DSBangQL,
//     result : result
//   });
//   db._disconnect();
// });
route.get('/manage-table',  (req,res)=>{
  console.log('manaage');
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
  // result = [
  //   {_id: '1fasfs', TenTheLoai:'Mang may tinh', SoKhoaHoc:10},
  //   {_id: '12fasfwfw', TenTheLoai:'Mang12h', SoKhoaHoc:10},
  //   {_id: '1àasdwfqwf', TenTheLoai:'Mang 124inh', SoKhoaHoc:12},
  //   {_id: '1qưeqwr3r3t', TenTheLoai:'Mang m124tinh', SoKhoaHoc:140},
  // ];
  
});

route.use('/manage-table/TheLoai', crudTheLoai);
route.use('/manage-table/KhoaHoc', crudKhoaHoc);
route.use('/manage-table/GiangVien', crudGiangVien);
route.use('/manage-table/HocVien', crudHocVien);
route.use('/manage-table/ThongKe', crudThongKe);
module.exports = route;
