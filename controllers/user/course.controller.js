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
const DanhGia = require('../../models/schema/DanhGia.model');


route.get('/', async (req, res) => {
    console.log("go to course");

});
route.get('/:courseid', async (req,res)=>{
    var user_id = -1;
    if(req.user){
        user_id =  req.user._id;
    }
    const course_id = req.params.courseid;
    db._connect(); 
    const theloai = await TheLoaiCap1.find().populate('TheLoaiCon').lean();

    const course = await KhoaHoc.findById(course_id).lean();
    const teacher = await GiangVien.findOne({"_id":course.GiangVien}).lean();
    var user  = -1, myCmt, cmt;
    if(user_id != -1){
        user = await HocVien.findOne({ "_id": user_id}).lean();
        myCmt = await DanhGia.findOne({"idKhoaHoc":course_id,"idHocVien":user_id}).lean();
        cmt = await DanhGia.find({"idKhoaHoc":course_id}).lean();    
        for ( i in cmt){
            let TacGia = await HocVien.findOne({"_id":cmt[i].idHocVien}).select('Ten -_id').lean();
            cmt[i].TacGia = TacGia;
        };
    }
    const data_hinhanh = await photosfiles.findById(course.AnhDaiDien).lean(); 
    const data_chunks = await photoschunks.find({files_id : data_hinhanh._id}).lean();
    if(!data_chunks || data_chunks.length === 0){               
        db._disconnect();      
    return res.send('No data found~');
    }
    let fileData = [];          
    for(let i=0; i<data_chunks.length;i++){                           
        fileData.push(data_chunks[i].data.toString('base64'));          
    }
    //Display the chunks using the data URI format          
    let finalFile = 'data:' + data_hinhanh.contentType + ';base64,' 
        + fileData.join('');  
        course.AnhDaiDien = finalFile;
        
    const theloai2 = await TheLoaiCap2.findOne({"_id":course.TheLoai2})
                    .populate({path:'DSKhoaHoc'})
                    .lean();
    var khoahoc, chuong;
    try {
        khoahoc = await KhoaHoc.findById(course_id)
        .populate({path:'DeCuong', populate : {path:'DSBaiHoc'}}).lean();
    
    
    } catch (error) {
        console.log('error :>> ', error);
    }
    chuong = khoahoc.DeCuong;
                    
    const totalHV = course.DSHocVien.length;
    const course_latest = theloai2.DSKhoaHoc;
    var i = 0;
    for (const item of course_latest) {
        const data_hinhanh = await photosfiles.findById(item.AnhDaiDien).lean(); 
        const data_chunks = await photoschunks.find({files_id : data_hinhanh._id}).lean();
        if(!data_chunks || data_chunks.length === 0){               
        db._disconnect();      
        return res.send('No data found~');
        }
        let fileData = [];          
        for(let i=0; i<data_chunks.length;i++){                  
        fileData.push(data_chunks[i].data.toString('base64'));          
        }
        //Display the chunks using the data URI format          
        let finalFile = 'data:' + data_hinhanh.contentType + ';base64,' 
            + fileData.join('');  
            course_latest[i].AnhDaiDien = finalFile;
        i++;   
    }

    //
    var check_login_and_permission = false;
    if(user_id != -1){          // had login
        var found =  -1;
        for ( i of khoahoc.DSHocVien){
            if(i==user_id){
                found = 1;
                break;
            }
        }
        if(found>=0){
            check_login_and_permission = true;
            console.log('permiss');
        }
        else {
            console.log('not found');
        }
    }
    var chuong_trial, chuong_no_permission;
    if(check_login_and_permission == false ){
        chuong_trial = chuong[0];
        chuong_no_permission = chuong.slice(1);
    }
    res.render('user/courseDetail',{
        title: "Lectureslist",
        layout: 'main',
        course :course,
        user: user,
        teacher: teacher,
        DanhGia: cmt,
        TheLoai2: theloai2,
        theloai,
        course_latest:course_latest,
        totalHV: totalHV,
        check_login_and_permission,
        chuong_trial, 
        chuong_no_permission,
        MyCmt: myCmt,
        chuong: chuong,
        isAuthentication: req.isAuthenticated()
    })
    db._disconnect();
});

route.get('/:courseid/lecture/:lectureid', async (req,res)=>{
    console.log('go to lecture');

    var user_id = -1;
    if(req.user){
        user_id =  req.user._id;
    }
    // const user_id = '6005a1620da9e151e81a5224';
    const course_id = req.params.courseid;
    const lecture_id = req.params.lectureid;
    db._connect();
    var user = -1
    if(user_id != -1){
        user = await HocVien.findById(user_id).lean();
    }
    var khoahoc, chuong, baihoc;
    try {
        khoahoc = await KhoaHoc.findById(course_id)
        .populate({path:'DeCuong', populate : {path:'DSBaiHoc'}}).lean();
    
    
    } catch (error) {
        console.log('error :>> ', error);
    }
    chuong = khoahoc.DeCuong;
    try {
        baihoc = await BaiHoc.findById(lecture_id).lean();
    } catch (error) {
        console.log('error :>> ', error);
    }
    var check_login_and_permission = false;
    if(user_id != -1){          // had login
        var found =  -1;
        for ( i of khoahoc.DSHocVien){
            if(i==user_id){
                found = 1;
                break;
            }
        }
        if(found>=0){
            check_login_and_permission = true;
            console.log('permiss');
        }
        else {
            console.log('not found');
        }
    }
    var chuong_trial, chuong_no_permission;
    if(check_login_and_permission === false ){
        chuong_trial = chuong[0];
        for(i of chuong_trial.DSBaiHoc){
            if(i._id==lecture_id){
                i.active = true;
            }
        }
        chuong_no_permission = chuong.slice(1);
    }
    for (i in chuong){
        for (j in chuong[i].DSBaiHoc){
            if (chuong[i].DSBaiHoc[j]._id==lecture_id){
                chuong[i].DSBaiHoc[j].active = "true";
            }
        }
    }
    //retrive vid
    const data_video = await fsfiles.findById(baihoc.Video).lean(); 
    const data_chunks = await fschunks.find({files_id : data_video._id}).lean();
    if(!data_chunks || data_chunks.length === 0){               
      db._disconnect();      
      return res.send('No data found~');
    }
    let fileData = [];          
    for(let i=0; i<data_chunks.length;i++){                   
      fileData.push(data_chunks[i].data.toString('base64'));          
    }
    //Display the chunks using the data URI format          
    let finalFile = 'data:' + data_video.contentType + ';base64,' 
        + fileData.join('');  
    baihoc.Video = finalFile;

    db._disconnect();
    res.render('user/lecture',{
        title: "Lecture",
        layout: 'user/course',
        khoahoc,
        check_login_and_permission,
        chuong_no_permission,
        chuong_trial,
        chuong,
        baihoc,
        user: user,
        isAuthentication: req.isAuthenticated()
    })
    




});



module.exports = route;