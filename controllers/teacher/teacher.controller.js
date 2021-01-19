const  express = require('express');
const route = express.Router();
const db = require('../../utils/db');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const bodyParser = require('body-parser');
const Admin = require('../../models/schema/Admin.model');
const KhoaHoc = require('../../models/schema/KhoaHoc.model');
const BaiHoc = require('../../models/schema/BaiHoc.model');
const GiangVien = require('../../models/schema/GiangVien.model');
const HocVien = require('../../models/schema/HocVien.model');
const TheLoaiCap1 = require('../../models/schema/TheLoaiCap1.model');
const TheLoaiCap2  =require('../../models/schema/TheLoaiCap2.model');
const Chuong  =require('../../models/schema/Chuong.model');
// const ThongKe = require('../../models/schema/ThongKe.model');
const photosfiles = require('../../models/schema/photos.files.model');
const photoschunks = require('../../models/schema/photos.chunks.model');
const fsfiles = require('../../models/schema/fs.files.model');
const fschunks = require('../../models/schema/fs.chunks.model');
const bcrypt = require('bcrypt');

const GridFsStorage = require("multer-gridfs-storage");
const upload = require("../../middleware/upload");
const multer = require("multer");


route.get('/', async (req,res )=>{
  if (!req.isAuthenticated()){
    res.redirect('/login');
    return; 
}
if(+req.user.Role !=1){
  res.redirect('/');
  return;
}
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
  if (!req.isAuthenticated()){
    res.redirect('/login');
    return; 
}
if(+req.user.Role !=1){
  res.redirect('/');
  return;
}
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
  if (!req.isAuthenticated()){
    res.redirect('/login');
    return; 
}
if(+req.user.Role !=1){
  res.redirect('/');
  return;
}
  console.log('tạo khóa học');
  const _id = req.user._id;
  db._connect();
  const user = await GiangVien.findById(_id).lean();
  const data = await TheLoaiCap1.find().populate('TheLoaiCon').lean();
  db._disconnect();
  var theloai = [];
  for (const item of data) {
  
    theloai = theloai.concat(item.TheLoaiCon);

  }
  res.render( 'teacher/createcourse' ,{
    layout:'teacher/t_main',
    title : 'Create course',
    theloai : theloai,
    user : user
  })
});

route.post('/addCourse', async (req,res)=>{
  db._connect();
  if (!req.isAuthenticated()){
    res.redirect('/login');
    return; 
}
if(+req.user.Role !=1){
  res.redirect('/');
  return;
}
  console.log('get add course');
  const user = req.user;
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
          await GiangVien.findByIdAndUpdate(user._id, {$pull:{DSKhoaHocDay:khoahoc._id}} );
          console.log('save khoa hoc to giang vien');
          const theloai2 = await TheLoaiCap2.findByIdAndUpdate(_idTheLoai, {$push:{DSKhoaHoc:khoahoc._id}});
          await TheLoaiCap2.findByIdAndUpdate(_idTheLoai,{SoKhoaHoc : (+theloai2.SoKhoaHoc + 1)})
          console.log('cap nhat so luong khoa hoc 2');
          const theloai1 = await TheLoaiCap1.find();
          var temp;
          for (const item of theloai1) {
            
            var found = item.TheLoaiCon.indexOf(theloai2._id);
            if(found>=0){
              temp = item;
              break;
            }
          }
          await TheLoaiCap1.findByIdAndUpdate(temp._id,{SoKhoaHoc : +temp.SoKhoaHoc + 1});
          console.log('cap nhat so luong khoa hoc 1');
          db._disconnect();
          res.redirect('/teacher/mycourses')
      }
    });

});

route.get('/mycourses', async (req,res)=>{
  if (!req.isAuthenticated()){
    res.redirect('/login');
    return; 
}
if(+req.user.Role !=1){
  res.redirect('/');
  return;
}
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
  console.log('khoahoc[0] :>> ', khoahoc[0]);
  db._disconnect();  
    res.render( 'teacher/mycourses' ,{
      layout:'teacher/t_main',
      title : 'My courses',
      user : user,  
      khoahoc : khoahoc,
    }) ;  
  
  
});

route.get('/detailcourse/:id', async (req,res)=>{
  if (!req.isAuthenticated()){
    res.redirect('/login');
    return; 
}
if(+req.user.Role !=1){
  res.redirect('/');
  return;
}
  const _id_khoahoc = req.params.id;
  const _id = req.user._id;
  db._connect();
  const user = await GiangVien.findById(_id).lean();
  const khoahoc = await KhoaHoc.findById(_id_khoahoc).populate('TheLoai2','TenTheLoai').lean();
  //console.log('khoahoc :>> ', khoahoc);
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
  if (!req.isAuthenticated()){
    res.redirect('/login');
    return; 
}
if(+req.user.Role !=1){
  res.redirect('/');
  return;
}
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

route.post('/detailcourse/:id/deleteCourse', async (req,res)=>{
  console.log('delete coutse');
  if (!req.isAuthenticated()){
    res.redirect('/login');
    return; 
}
if(+req.user.Role !=1){
  res.redirect('/');
  return;
}
  const {_id, id_theloai} = req.body;
  db._connect();
  const khoahoc = await KhoaHoc.findByIdAndDelete(_id);
  console.log('xoa khoa hoc');
  const theloai2 = await TheLoaiCap2.findById(id_theloai);
  await TheLoaiCap2.findByIdAndUpdate(id_theloai,{SoKhoaHoc:+theloai2.SoKhoaHoc - 1});
  console.log('cap nhat so khoa hoc 2');
  await TheLoaiCap2.findByIdAndUpdate(id_theloai, {$pull:{DSKhoaHoc:khoahoc._id}});
  console.log('xoa khoa hoc khoi ds');
  
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
  res.redirect('/teacher/mycourses');
});




route.post('/changeinfo', async (req,res)=>{
  console.log('change');
  if (!req.isAuthenticated()){
    res.redirect('/login');
    return; 
}
if(+req.user.Role !=1){
  res.redirect('/');
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

route.get('/reference/:id', async(req,res)=>{
  console.log(' vo ref ne');
  if (!req.isAuthenticated()){
    res.redirect('/login');
    return; 
}
if(+req.user.Role !=1){
  res.redirect('/');
  return;
}
  const _id = req.user._id;
  const id_khoahoc = req.params.id;
  db._connect();
  const user = await GiangVien.findById(_id).lean();
  const khoahoc = await KhoaHoc.findById(id_khoahoc)
  .populate({path:'DeCuong', populate: { path: 'DSBaiHoc' }})
  .lean();
  // console.log('khoahoc :>> ', khoahoc);
  db._disconnect();
  res.render('teacher/reference',{
    title:"Change Password" ,
    layout : 'teacher/t_main',
    user : user,
    khoahoc : khoahoc,
  });
});

route.post('/reference/add', async(req,res)=>{
  console.log(' vo add reff');
  if (!req.isAuthenticated()){
    res.redirect('/login');
    return; 
}
if(+req.user.Role !=1){
  res.redirect('/');
  return;
}
  const _id = req.user._id;
  const id_khoahoc = req.body._idkhoahoc;
  const tenchuong = req.body.tenchuong;
  db._connect();
  const chuong = new Chuong({
    TenChuong:tenchuong,
    beLongTo : id_khoahoc,
    DSBaiHoc :[]
  })
  try{
    await chuong.save();
  }catch(err){
    console.log('err :>> ', err);
    return res.redirect('./'+ id_khoahoc);
  }
  console.log('add chuong');
  const khoahoc = await KhoaHoc.findByIdAndUpdate(id_khoahoc, 
    {$push: {DeCuong: chuong._id}, CapNhatCuoi:new Date()});
  console.log('add chuong to khoa hoc');
  db._disconnect();
  res.redirect('./'+id_khoahoc);
});


route.post('/reference/edit', async(req,res)=>{
  console.log(' vo edit reff');
  if (!req.isAuthenticated()){
    res.redirect('/login');
    return; 
}
if(+req.user.Role !=1){
  res.redirect('/');
  return;
}
  const _id = req.user._id;
  const id_chuong = req.body.id_chuong;
  const tenchuong = req.body.tenchuong;
  console.log('id_chuong :>> ', id_chuong);
  console.log('tenchuong :>> ', tenchuong);
  db._connect();
  const chuong = await Chuong.findByIdAndUpdate(id_chuong, {TenChuong:tenchuong});
  console.log('edit chuong');
  db._disconnect();
  res.redirect('./'+chuong.beLongTo);
});

route.post('/reference/delete', async(req,res)=>{
  console.log(' vo delete chuong');
  if (!req.isAuthenticated()){
    res.redirect('/login');
    return; 
}
if(+req.user.Role !=1){
  res.redirect('/');
  return;
}
  const _id = req.user._id;
  const id_chuong = req.body.id_chuong;
  db._connect();
  const chuong = await Chuong.findByIdAndRemove(id_chuong);
  console.log('delete chuong');
  db._disconnect();
  res.redirect('./'+chuong.beLongTo);
});

route.post('/reference/addLesson', async(req,res)=>{
  console.log(' vo add lesson');
  if (!req.isAuthenticated()){
    res.redirect('/login');
    return; 
}
if(+req.user.Role !=1){
  res.redirect('/');
  return;
}
  const _id = req.user._id;

  db._connect();
  var file;
  //video
    upload(req, res, async function(error){
      if (error) {
        console.log(error);
        return res.send(`Error when trying upload image: ${error}`);
      }
      else{
        const {tenbaihoc, id_chuong} = req.body;
        if (req.file == undefined) {
          return res.send(`You must select a file.`); ;
        }
        console.log(`File has been uploaded.`);
        file = req.file;  
        const lesson = new BaiHoc({
          TenBaiHoc : tenbaihoc,
          Video:file.id
        });
        try{
          await lesson.save();
          console.log('save new baihoc');
        } catch(err) {console.log('err :>> ', err)};
        
        const chuong = await Chuong.findByIdAndUpdate(id_chuong, {$push:{ DSBaiHoc: lesson._id}});
          //luu khoa hoc
          db._disconnect();
          res.redirect('./'+ chuong.beLongTo);
      }
    });
});

route.post('/reference/editLesson', async(req,res)=>{
  console.log(' vo edit reff editLesson ');
  if (!req.isAuthenticated()){
    res.redirect('/login');
    return; 
  }
  if(+req.user.Role !=1){
    res.redirect('/');
    return;
  }
  const {_id, parent_id: id_chuong, tenbaihoc} = req.body;
  db._connect();
  const chuong = await Chuong.findById(id_chuong);
  try {
    const baihoc = await BaiHoc.findByIdAndUpdate(_id,{TenBaiHoc:tenbaihoc});
  } catch (error) {
    console.log('error :>> ', error);
  }

  console.log('edit ten bai hoc ');
  // console.log('chuong :>> ', chuong);
  db._disconnect();
  res.redirect('./'+chuong.beLongTo);
});

route.post('/reference/deleteLesson', async(req,res)=>{
  console.log(' vo delete baihoc');
  if (!req.isAuthenticated()){
    res.redirect('/login');
    return; 
  }
  if(+req.user.Role !=1){
    res.redirect('/');
  return;
  }
  const {_id, parent_id: id_chuong} = req.body;
  console.log('_id :>> ', _id);
  console.log('id_chuong :>> ', id_chuong);
  db._connect();
  var baihoc;
  try {
    baihoc = await BaiHoc.findByIdAndRemove(_id);
  } catch (error) {
    console.log('error :>> ', error);
    return;
  }
  var chuong;
  try {
    chuong = await Chuong.findByIdAndUpdate(id_chuong, {$pull:{ DSBaiHoc: _id}});
  } catch (error) {
    console.log('error :>> ', error);
    return;
  }
  var file;
  try {
    file = await fsfiles.findByIdAndDelete(baihoc.Video);
  } catch (error) {
    console.log('error :>> ', error);
    return;
  }

  try {
    await fschunks.deleteMany({files_id:file._id});
  } catch (error) {
    console.log('error :>> ', error);
    return;
  }
  console.log('delete bai hoc');
  db._disconnect();
  res.redirect('./'+chuong.beLongTo);
});

route.get("/changepw", async (req,res)=>{ 
  if (!req.isAuthenticated()){
    res.redirect('/login');
    return; 
}
if(+req.user.Role !=1){
  res.redirect('/');
  return;
}
  const _id =  req.user._id ;
  db._connect(); 
  var user = await GiangVien.findById(_id).lean();
  res.render('teacher/changepw',{
      title:"Change Password" ,
      layout : 'teacher/t_main',
      user : user,
  });
  db._disconnect();
});

route.post("/postchangepw2", async (req, res) => {
  db._connect(); 
  if (!req.isAuthenticated()){
    res.redirect('/login');
    return; 
}
if(+req.user.Role !=1){
  res.redirect('/');
  return;
}
  var ID = req.query.id;  
  var curpw = req.query.curpw;
  var newpw  = req.query.newpw;
  var user = await GiangVien.findById(ID);
  if(!comparePassword(curpw,user.Password)){
      res.send('incorrect');
      return;
  }
  else{console.log("dung");}
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
  console.log('log out teacher');
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
