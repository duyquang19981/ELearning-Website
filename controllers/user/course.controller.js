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
const GiangVien = require('../../models/schema/GiangVien.model');
const HocVien = require('../../models/schema/HocVien.model');
const TheLoaiCap1 = require('../../models/schema/TheLoaiCap1.model');
const TheLoaiCap2  =require('../../models/schema/TheLoaiCap2.model');

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
        userinfo: userinfo,
        DanhGia: DanhGia,
        isAuthentication: req.isAuthenticated()
    })
    db._disconnect();
});

module.exports = route;