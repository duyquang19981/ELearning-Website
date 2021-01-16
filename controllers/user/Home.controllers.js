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


// route.get('/',async (req, res) => {
//     if(req.isAuthenticated()){
//         console.log('req.user :>> ', req.user);
//         res.render('user/home',{
//             isAuthentication: req.isAuthenticated(),
//             user:req.user
//         });
//     }
//     res.render('user/home',{
        
//     });
// });
//   app.get('/login', async(req,res)=>{
//     res.render('user/login',{
//       layout : false,~

//     });
//   });

route.get('/', async (req, res) => {
    
    db._connect();
      
    const mostView = await KhoaHoc.find({}).sort({LuotXem: -1}).limit(10).lean();
    // cheapest.map(async (course) => {
    //     course.Gia = course.Gia / 1000;
    //     let mydate = new Date(course.NgayDang);
    //     course.NgayDang = mydate.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    //     course.totalStudent = Math.floor(Math.random() * 20) + 10;
    // });

    const newest = await KhoaHoc.find({}).sort({NgayDang: -1}).limit(10).lean();
    // newest.map(async (course) => {
    //     course.Gia = course.Gia / 1000;
    //     let mydate = new Date(course.NgayDang);
    //     course.NgayDang = mydate.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    //     course.totalStudent = Math.floor(Math.random() * 20) + 10;
    // });

    const bestCourse = await KhoaHoc.find({}).sort({DiemDanhGia:-1}).limit(4).lean();
    // bestCourse.map(async (course) => {
    //     course.Gia = course.Gia / 1000;
    //     let mydate = new Date(course.NgayDang);
    //     course.NgayDang = mydate.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    //     course.totalStudent = Math.floor(Math.random() * 20) + 10;
    // });
    console.log(bestCourse);
    if(req.isAuthenticated()){
        // const linhvucfollow = await ChucNang.findOne({belongTo: req.user._id});
        // let khoaHocLQ = await KhoaHoc.find({LinhVuc: linhvucfollow.LinhVuc[0]}).limit(6).populate('GiaoVien', 'TenGiaoVien').lean();
        // if(!khoaHocLQ.length){
        //     khoaHocLQ = await KhoaHoc.find({}).limit(6).populate('GiaoVien', 'TenGiaoVien').lean();
        // }

        db._disconnect();
        return res.render('user/home', { mostView, newest,bestCourse, isAuthentication: req.isAuthenticated()});
    }else{
        db._disconnect();
        return res.render('user/home', { mostView, newest, bestCourse, isAuthentication: req.isAuthenticated()});
    }
    
});

// route.get(contants.COURSE_ID_LINK, async (req, res) => {
//     db._connect();
//     const { _id } = req.params;
//     const course = await KhoaHoc.findOne({ _id }).lean();
//     const course_latest = await KhoaHoc.find({ _id: { $ne: _id } }).limit(3).lean();
//     const teacher = await GiaoVien.findOne({ _id: course.GiaoVien }).lean();
//     const chuong = await Chuong.find({ KhoaHoc: _id }).lean();;
//     const comment = await BinhLuan.find({ KhoaHoc: _id }).sort({NgayPost:"desc"}).populate('User').lean();
//     const {TenLinhVuc} = await LinhVuc.findOne({_id: course.LinhVuc}).lean();
//     console.log(TenLinhVuc)
//     course.rate = comment.length;
//     comment.forEach(cmt => {
//         let mydate = new Date(cmt.NgayPost);
//         cmt.datePost = mydate.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
//     });
//     let rating_hbs = '';
//     for (let i = 0; i < course.Rating; i++) {
//         rating_hbs += `<i></i>`
//     }
//     course.rating_hbs = rating_hbs;
//     let UserId = '';
//     if(req.isAuthenticated()){
//         UserId = req.user._id;
//     }
//     db._disconnect();
//     res.render('detailcourse', { course, course_latest, teacher, chuong, comment, totalLec: chuong.length ,isAuthentication: req.isAuthenticated(), User: UserId, TenLinhVuc});
// })

route.get('/login', checkNotAuthenticated, (req, res) => {
    console.log('log in get ');
    //console.log(req.flash('error'));
    req.session.returnTo = req.header('Referer');
    //var msg = req.flash('error');
    
    res.render('user/login',{
        layout : 'user/sign',
        title : 'Log In',
        msg: req.flash('error'),
        
        
    });
});

route.get('/register',checkNotAuthenticated, async (req, res) => {
    //get linhvuc
    //db._connect();
    //const linhvuc = await LinhVuc.find().limit(8).lean();
    res.render('user/register', {
        title : 'Register',
        layout : 'user/sign',
    });
});
// // ! TODO
route.post('/login', passport.authenticate('local',{
        failureRedirect: '/login', 
        failureFlash: 'Invalid username or password.', 
        failureFlash: true}), (req, res) => {
        console.log('post login');
        if (req.session.returnTo) {
            returnTo = req.session.returnTo
            delete req.session.returnTo
            return res.redirect(returnTo);
        }
        return res.redirect('/');
    }
);

route.post('/register', async (req, res) => {
    console.log('post register');
    if(
		req.body['g-recaptcha-response'] === undefined ||
		req.body['g-recaptcha-response'] === '' ||
		req.body['g-recaptcha-response'] === null
	){
		return res.render('user/register',{
            layout : 'user/sign',
            msg:"Check Captcha!!!",
            title:'Register' });

    }
    // const {topic} = req.body ;
    const { ten, username, password, mail } = req.body;

    console.log('ten :>> ', ten);
    console.log('username :>> ', username);
    console.log('password :>> ', password);
    console.log('mail :>> ', mail);
    // *Check data
    // *TODO
    try {
        db._connect();
        let user = new HocVien({ 
            Ten: ten, 
            Mail: mail,
            Username : username,
            Password: hashPassword(password), 
            DSKhoaHocDK: [],
            WatchList:[],
            GioHang:[],
        });
        await user.save();
        console.log('save new Hoc vien');
        db._disconnect();

        return res.redirect('/login',)
    } catch (error) {
        console.log(error)
        
        return res.render('user/register', {
                title : 'Register',
                layout : 'user/sign',
                "msg":"Error!!!"
            }); 
    }

});

route.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
})


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

route.get('/category', async(req,res)=>{
    db._connect();

    const courses = await KhoaHoc.find({}).lean();
    courses.map(async (course) => {
        course.Gia = course.Gia / 1000;
        var mydate = new Date(course.NgayDang);
        course.NgayDang = mydate.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
        course.totalStudent = Math.floor(Math.random() * 20) + 10;

    });

    db._disconnect();
    res.render('category',{bestCourse: courses, isAuthentication: req.isAuthenticated()});

});

route.post('/createComment', async (req, res) => {

        db._connect();
        const data = req.body;
        //console.log(data);
        KhoaHoc.findOneAndUpdate({_id:data.KhoaHoc},{$push:{DSHocVien_DanhGia: {idHocVien: data.User_id,NgayDang:data.NgayPost,DiemDanhGia :data.DiemDanhGia, PhanHoi:data.PhanHoi}}}, function(err){
            if(err){
                console.log('err' + err);
                res.send({status:'Failed'});
            }
            else{
                console.log('added');   
                res.send({status:'Successed'});
            }
        });

});
module.exports = route;