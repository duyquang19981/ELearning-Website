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
const photosfiles = require('../../models/schema/photos.files.model');
const photoschunks = require('../../models/schema/photos.chunks.model');
const bcrypt = require('bcrypt');

const GridFsStorage = require("multer-gridfs-storage");
const upload = require("../../middleware/upload");
const multer = require("multer");


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
  db._disconnect();
  var theloai = [];
  data.forEach(element => {
    theloai = theloai.concat(element.TheLoaiCon);
  });
  res.render( 'teacher/createcourse' ,{
    layout:'teacher/t_main',
    title : 'Create course',
    theloai : theloai,
    user : user
  })
});

route.post('/addCourse', async (req,res)=>{
  console.log('get add course');
  const user = req.user;
  //console.log('user :>> ', user);
  db._connect();
  var file;
  //img
    upload(req, res, async function(error){
      if (error) {
        console.log(error);
        return res.send(`Error when trying upload image: ${error}`);
      }
      else{
        const {tenkhoahoc, _idTheLoai, hocphi, khuyenmai, motangan, motachitiet} = req.body;
        if (req.file == undefined) {
          return res.send(`You must select a file.`); ;
        }
        console.log(`File has been uploaded.`);
        file = req.file;  
        const khoahoc = new KhoaHoc({ 
            TenKhoaHoc : tenkhoahoc,
            TheLoai2 : mongoose.Types.ObjectId(_idTheLoai),
            GiangVien : mongoose.Types.ObjectId(user._id),
            HocPhiGoc : hocphi,
            KhuyenMai : khuyenmai,
            MoTaNgan : motangan,
            MoTaChiTiet : motachitiet,
            TrangThai : 1,
            AnhDaiDien: mongoose.Types.ObjectId(file.id),
            DSHocVien : [],
            DeCuong : [],
            DiemDanhGia: 0,
            LuoiXem : 0
          });
         
          //luu khoa hoc
          await khoahoc.save();
          console.log('save Khoa hoc');
          console.log('khoahoc._id :>> ', khoahoc._id);
          await GiangVien.findByIdAndUpdate(user._id, {$push:{DSKhoaHocDay:khoahoc._id}} );
          console.log('save khoa hoc to giang vien');
          db._disconnect();
          res.redirect('./')
      }
    });

});

route.get('/mycourses', async (req,res)=>{
  console.log('tds khoa hoc giang vien');
  const _id = req.user._id;
  db._connect();
  const user = await GiangVien.findById(_id).lean();
  const khoahoc = await KhoaHoc.find({GiangVien : user._id})
  .populate('TheLoai2', 'TenTheLoai')
  .lean();
  var i = 0;
  for (const item of khoahoc) {
    const data_hinhanh = await photosfiles.findById(item.AnhDaiDien).lean(); 
    const data_chunks = await photoschunks.find({files_id : data_hinhanh._id}).lean();
    if(!data_chunks || data_chunks.length === 0){               
      db._disconnect();      
      return res.send('No data found~');
    }
    let fileData = [];          
    for(let i=0; i<data_chunks.length;i++){            
      //This is in Binary JSON or BSON format, which is stored               
      //in fileData array in base64 endocoded string format               
      fileData.push(data_chunks[i].data.toString('base64'));          
    }
    //Display the chunks using the data URI format          
    let finalFile = 'data:' + data_hinhanh.contentType + ';base64,' 
          + fileData.join('');  
    khoahoc[i].AnhDaiDien = finalFile;
    i++;   
  }
  db._disconnect();  
    res.render( 'teacher/mycourses' ,{
      layout:'teacher/t_main',
      title : 'My courses',
      user : user,  
      khoahoc : khoahoc,
    }) ;  
  
  
});

route.get('/detailcourse/:id', async (req,res)=>{
  const _id_khoahoc = req.params.id;
  const _id = req.user._id;
  db._connect();
  const user = await GiangVien.findById(_id).lean();
  const khoahoc = await KhoaHoc.findById(_id_khoahoc).populate('TheLoai2','TenTheLoai').lean();
  console.log('khoahoc :>> ', khoahoc);
  db._disconnect();
  res.render( 'teacher/editcourse' ,{
    layout:'teacher/t_main',
    title : 'Detail',
    user : user,  
    khoahoc : khoahoc,
  });  

});

route.post('/detailcourse/:id/editCourse', async (req,res)=>{
  console.log('edit coutse');

  const {_id,ten,hocphi,khuyenmai,motangan,motachitiet} = req.body;
  db._connect();
  await KhoaHoc.findByIdAndUpdate(_id,{
    TenKhoaHoc : ten,
    HocPhiGoc : +hocphi,
    KhuyenMai : +khuyenmai,
    MoTaNgan : motangan,
    MoTaChiTiet : motachitiet,
    CapNhatCuoi : new Date(),
  });
  db._disconnect();
  console.log('chinh sua khoa hoc xong');
  res.redirect('../'+_id)
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
