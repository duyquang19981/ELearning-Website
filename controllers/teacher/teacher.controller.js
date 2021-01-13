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
// const crudTheLoai = require('./crudTheLoai');
// const crudKhoaHoc = require('./crudKhoaHoc');
// const crudGiangVien = require('./crudGiangVien');
// const crudHocVien = require('./crudHocVien');
// const crudThongKe = require('./crudThongKe');
const bcrypt = require('bcrypt');


route.get('/', async (req,res )=>{
  const _id = req.user._id;
  db._connect();
  const user = await GiangVien.findById(_id).lean();
  db._disconnect();
  console.log('go to teacher');
  console.log('user :>> ', user);
  res.render('teacher/dashboard',{
    layout:'teacher/t_main',
    title : '',
    user : user
  });
});

route.get('/profile', async (req,res )=>{
  const _id = req.user._id;
  db._connect();
  const user = await GiangVien.findById(_id).lean();
  db._disconnect();
  console.log('go to teacher profile');
  console.log('user :>> ', user);
  res.render('teacher/teacher_profile',{
    layout:'teacher/t_main',
    title : 'Profile',
    user : user
  });
});


route.get('/createCourse', async (req,res)=>{
  console.log('tạo khóa học');
  const _id = req.user._id;
  db._connect();
  const user = await GiangVien.findById(_id);
  const data = await TheLoaiCap1.find().populate('TheLoaiCon').lean();
  console.log('data :>> ', data);
  db._disconnect();
  var theloai = [];
  data.forEach(element => {
    theloai = theloai.concat(element.TheLoaiCon);
  });
  res.render( 'teacher/createcourse' ,{
    layout:'teacher/t_main',
    title : 'Create course',
    theloai : theloai,
    //user : user
  })
  
});

route.get('/addCourse', async (req,res)=>{
  console.log('get add course');
  const user = req.user;
  console.log('user :>> ', user);
  const {tenkhoahoc, _idTheLoai, hocphi, khuyenmai, motangan, motachitiet} = req.query;
  db._connect();
  const khoahoc = new KhoaHoc({ 
    TenKhoaHoc : tenkhoahoc,
    TheLoaiCap2 : mongoose.Types.ObjectId(_idTheLoai),
    GiangVien : mongoose.Types.ObjectId(user._id),
    HocPhiGoc : hocphi,
    KhuyenMai : khuyenmai,
    MoTaNgan : motangan,
    MoTaChiTiet : motachitiet,
    TrangThai : 1,
    AnhDaiDien: 'sfsfsf',
    DSHocVien : [],
    DeCuong : [],
    DiemDanhGia: 2,
    LuoiXem : 5
  });
  await khoahoc.save();
  console.log('save Khoa hoc');
  db._disconnect();
  // var theloai = [];
  // data.forEach(element => {
  //   theloai = theloai.concat(element.TheLoaiCon);
  // });
  // res.render( 'teacher/createcourse' ,{
  //   layout:'teacher/t_main',
  //   title : 'Create course',
  //   theloai : theloai,
  //   //user : user
  // })
  
});

route.post('/changeinfo', async (req,res)=>{
  console.log('change');
  if (!req.isAuthenticated()){
      
      res.redirect('/Login/');
      return; 
  }
  const _id = req.user._id;
  const { ten, mail} = req.body;
  db._connect(); 
  const gv = await GiangVien.findById(_id);
  console.log('gv :>> ', gv);
  db._connect();
  GiangVien.findByIdAndUpdate(_id,{Ten:ten, Mail:mail},function (err,doc) {
    if (err) return console.error(err);
    db._disconnect;
    res.redirect(`./profile`);
  });

});

route.get("/changepw", async (req,res)=>{ 
  if (!req.isAuthenticated()){
      res.redirect('/login');
      return; 
  }
  const _id =  req.user._id ;
  db._connect(); 
  var user = await GiangVien.findById(_id).lean();
  res.render('teacher/changepw',{
      title:"Change Password" ,
      layout : 'teacher/t_main',
      user : user,
      isAuthentication: req.isAuthenticated()
  });
  db._disconnect();
});

route.post("/postchangepw2", async (req, res) => {
  db._connect(); 
  var ID = req.query.id;  
  var curpw = req.query.curpw;
  var newpw  = req.query.newpw;
  var user = await GiangVien.findById(ID);
  if(!comparePassword(curpw,user.Password)){
      res.send('incorrect');
      return;
  }else{console.log("dung");}
  var changepw = await GiangVien.findByIdAndUpdate(ID,{Password:hashPassword(newpw)},function(err){
      if(err){
          console.log('Err: ', err);
          res.send('failed');
      }
      else{
          res.send('successed');
      }
  });
  db._disconnect();
}
);

route.get('/logout', (req, res) => {
  console.log('log out teacjer');
  req.logout();
  res.redirect('/');
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
const comparePassword = (myPassword, hash) => {
  return bcrypt.compareSync(myPassword, hash);
};

module.exports = route;
