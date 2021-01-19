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
route.get('/', async (req, res) => {
    console.log("go to course");

});
route.get('/:courseid/lectureslist', async (req,res)=>{
    
    if (!req.isAuthenticated()){
        
        res.redirect('/login');
        return; 
    }
    const _id =  req.user._id ;
    const courseID = req.params.courseid;
    db._connect(); 
    const course = await KhoaHoc.findById(courseID).lean();
    const userinfo = await HocVien.findOne({ "_id": _id}).lean();
    const DanhGia = course.DSHocVien_DanhGia;
    for ( i in DanhGia){
        // DanhGia[i]=DanhGia[i].toObject();
        let TacGia = await HocVien.findOne({"_id":DanhGia[i].idHocVien}).select('Ten -_id').lean();
        DanhGia[i].TacGia = TacGia;
    };
    res.render('user/lectureslist',{
        title: "Lectureslist",
        layout: 'user/course',
        course :course,
        user: userinfo,
        DanhGia: DanhGia,
        isAuthentication: req.isAuthenticated()
    })
    db._disconnect();
});

route.get('/:courseid/lecture/:lectureid', async (req,res)=>{
    console.log('go to');
    // const user_id = req.user._id || -1;
    const user_id = '6005a1620da9e151e81a5224';
    const course_id = req.params.courseid;
    const lecture_id = req.params.lectureid;
    console.log('lecture_id :>> ', lecture_id);
    db._connect();
    var khoahoc, chuong, baihoc;
    try {
        khoahoc = await KhoaHoc.findById(course_id)
        .populate({path:'DeCuong', populate : {path:'DSBaiHoc'}}).lean();
        //console.log('khoahoc :>> ', khoahoc);
    
    } catch (error) {
        console.log('error :>> ', error);
    }
    chuong = khoahoc.DeCuong;
    try {
        baihoc = await BaiHoc.findById(lecture_id).lean();
    } catch (error) {
        console.log('error :>> ', error);
    }
    var check_login_and_permission = 0;
   
    if(user_id != -1){          // had login
        var found =  khoahoc.DSHocVien.indexOf(user_id);
        if(found>=0){
            check_login_and_permission = 1;
            // console.log('object :>> ', object);
            console.log('permiss');
        }
    }

    var chuong_trial, chuong_no_permission;
    if(check_login_and_permission === 0 ){
        chuong_trial = chuong[0];
        // var isActive = chuong_trial.DSBaiHoc.indexOf(lecture_id);
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
    //console.log('baihoc :>> ', baihoc);
    console.log('khoahoc :>> ', khoahoc);
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
        // user: userinfo,
        isAuthentication: req.isAuthenticated()
    })
    




});



module.exports = route;