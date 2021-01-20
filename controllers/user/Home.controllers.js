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
const Chuong  =require('../../models/schema/Chuong.model');
// const ThongKe = require('../../models/schema/ThongKe.model');
const photosfiles = require('../../models/schema/photos.files.model');
const photoschunks = require('../../models/schema/photos.chunks.model');
const fsfiles = require('../../models/schema/fs.files.model');
const fschunks = require('../../models/schema/fs.chunks.model');
const DanhGia = require('../../models/schema/DanhGia.model');

route.get('/',async (req, res) => {
    //tao admin account
    // db._connect();
    // const admin = new Admin({
    //     Username : 'admin',
    //     Password : hashPassword('admin'),
    //     DSBangQL :[
    //         {TenBang: 'Khóa học'},
    //         {TenBang: 'Giảng viên'},
    //         {TenBang: 'Học viên'},
    //         {TenBang: 'Thể loại'}
    //     ]
    // })
    // await admin.save();
    // db._disconnect();
    // return 0;
    db._connect();
    
    const theloai = await TheLoaiCap1.find().populate('TheLoaiCon').lean();
    // console.log('theloai :>> ', theloai);
    const theloainoibat = theloai[0].TheLoaiCon.slice(0,4);
    const mostView = await KhoaHoc.find({}).sort({LuotXem: -1}).limit(10).lean();
    const newest = await KhoaHoc.find({}).sort({NgayDang: -1}).limit(10).lean();
    const bestCourse = await KhoaHoc.find({}).sort({DiemDanhGia:-1}).limit(4).lean();
    //best course
    var i = 0;
    for (const item of bestCourse) {
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
            bestCourse[i].AnhDaiDien = finalFile;
        i++;   
    }
    //newest
    i=0;
    for (const item of newest) {
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
            newest[i].AnhDaiDien = finalFile;
        i++;   
    }
    //most view
    i=0;
    for (const item of mostView) {
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
            mostView[i].AnhDaiDien = finalFile;
        i++;   
    }
    db._disconnect();
    if(req.isAuthenticated()){
        const user = req.user;
        switch (user.Role) {
            case 0:
                return res.redirect('/admin');
                break;
            case 1:
                return res.redirect('/teacher');
                break;
            case 2:
                return res.render('user/home',{
                    isAuthentication: req.isAuthenticated(),
                    user:req.user,
                    theloai:theloai,
                    mostView, newest, bestCourse,
                    title:'Home|mELearning'
                });
                break;
            
            default:
                break;
        }
    }
    else{
        return res.render('user/home',{
            mostView, newest, bestCourse,
            theloai:theloai,
            theloainoibat,
            title:'Home|mELearning'
        });
    }
});


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
        if (req.session.returnTo) {
            returnTo = req.session.returnTo
            //delete req.session.returnTo
            return res.redirect(returnTo);
        }
        else{
            return res.redirect('/');
        }
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

route.post('/logout', (req, res) => {
    console.log('log out post');
    req.logout();
    console.log('req.header :>> ', req.header('Referer'));
    res.redirect(req.header('Referer'));
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
        //let check =0;
        const courseID =data.KhoaHoc;
        const _id =data.User_id;
        const check = await DanhGia.countDocuments({"idKhoaHoc":courseID,"idHocVien":_id}).exec();
        console.log(check);
        if(!check){
        
            const danhgia = new DanhGia({ 
                idKhoaHoc: data.KhoaHoc,
                idHocVien: data.User_id,
                NgayDang: data.NgayPost,
                DiemDanhGia: data.DiemDanhGia,
                PhanHoi: data.PhanHoi,
            });
        
            //luu khoa hoc
            danhgia.save( function(err){
                if(err){
                    console.log('err' + err);
                    res.send({status:'Add Cmt Failed'});
                }
                else{
                    console.log('added');   
                    res.send({status:'Add Cmt Successed'});
                }
            });
        }else{
            DanhGia.findOneAndUpdate({"idKhoaHoc":courseID,"idHocVien":_id},{PhanHoi:data.PhanHoi,DiemDanhGia:data.DiemDanhGia,NgayDang:data.NgayPost},function(err){
            if(err){
                console.log('err' + err);
                res.send({status:'Update Cmt Failed'});
            }
            else{
                console.log('added');   
                res.send({status:'Update Cmt Successed'});
            }
        });
        }
            //cap nhat lai DiemDanhGia
            const list_DanhGia = await DanhGia.find({"idKhoaHoc":data.KhoaHoc}).lean();
            let newRating =0;
            for (i in list_DanhGia){
                newRating+=list_DanhGia[i].DiemDanhGia;
            }
            console.log(list_DanhGia);
            newRating=newRating/(list_DanhGia.length);
            KhoaHoc.findByIdAndUpdate({"_id":data.KhoaHoc},{DiemDanhGia:newRating},function(err){
                if(err){
                    console.log('err' + err);
                }
                else{
                    console.log('added');   
                }
            });   

});

// route.post('/addtoCart', async (req, res) => {
//     if(!req.user){
//         return res.status(401).send({success: false, msg:"You must be login"});
//     }
    
//         db._connect();
//         const course = req.body.Course_id;
//         const user = req.body.User_id;
//         const UserInfo = HocVien.findOne({_id:user}).lean();
//         let check = UserInfo.GioHang.includes(course);
//         console.log(check);
//         if(check){
//             return res.status(409).send({success: true, msg:"Course has been already in cart"});
//         }
//         let check2 =UserInfo.DSKhoaHocDK.includes(course);
//         if(check){
//             return res.status(409).send({success: true, msg:"Course was bought"});
//         }
//         await HocVien.findOneAndUpdate({_id:user},{$push:{GioHang: course}});
//         return res.status(200).send({success: true, msg:"Course was added", mount: GioHang.length});
//         db._disconnect();

    
// })

//search 
route.get('/search', async (req, res) => {
    console.log('search ne');
    db._connect();
    const theloai = await TheLoaiCap1.find().populate('TheLoaiCon').lean();
    var user = -1;
    if(req.isAuthenticated()){
        user = await HocVien.findById(req.user._id).lean();
    }
    const searchkey = req.query.searchkey || "";
    const page = req.query.page || 1;
    const sortby = req.query.sortby || 0;
    const perPage = 3;
    let data = [];
    if(searchkey===""){
        if(+sortby === 0)
        {
            console.log('all no sort');
            const numberOfData = await KhoaHoc.find().countDocuments();
            totalPages = parseInt(Math.ceil(+numberOfData / perPage ));
            data = await KhoaHoc.find().populate('GiangVien', 'Ten').populate('TheLoai2','TenTheLoai')
            .skip(perPage*(page-1))
            .limit(perPage)
            .lean();
        }
        else if(+sortby === 1){  //gia tang dan
            console.log('all sortby gia tang');
            const numberOfData = await KhoaHoc.find().countDocuments();
            totalPages = parseInt(Math.ceil(+numberOfData / perPage ));
            data = await KhoaHoc.find().populate('GiangVien', 'Ten').populate('TheLoai2','TenTheLoai')
            .skip(perPage*(page-1))
            .limit(perPage)
            .sort({HocPhiGoc:1})
            .lean();
        }    
        else if(+sortby === 2){  //diem giam
            console.log('all sortby diem giam');
            const numberOfData = await KhoaHoc.find().countDocuments();
            totalPages = parseInt(Math.ceil(+numberOfData / perPage ));
            data = await KhoaHoc.find().populate('GiangVien', 'Ten').populate('TheLoai2','TenTheLoai')
            .skip(perPage*(page-1))
            .limit(perPage)
            .sort({DiemDanhGia:-1})
            .lean();
        }    
    }
    else{
        if(+sortby === 0){
            console.log('key no sort');
            const numberOfData = await KhoaHoc.find({$text: { $search: searchkey }}).count();
            totalPages = parseInt(Math.ceil(+numberOfData / perPage ));
            data = await KhoaHoc.find({$text: { $search: searchkey }}).populate('GiangVien', 'Ten').populate('TheLoai2','TenTheLoai')
            .skip(perPage*(page-1))
            .limit(perPage)
            .lean();
        }
        else if(+sortby === 1){
            console.log('key sortby gia tang');
            const numberOfData = await KhoaHoc.find({$text: { $search: searchkey }}).count();
            totalPages = parseInt(Math.ceil(+numberOfData / perPage ));
            data = await KhoaHoc.find({$text: { $search: searchkey }}).populate('GiangVien', 'Ten').populate('TheLoai2','TenTheLoai')
            .skip(perPage*(page-1))
            .limit(perPage)
            .sort({HocPhiGoc:1})
            .lean();
        }
        else if(+sortby === 2){
            console.log('key sortby diem giam');
            const numberOfData = await KhoaHoc.find({$text: { $search: searchkey }}).count();
            totalPages = parseInt(Math.ceil(+numberOfData / perPage ));
            data = await KhoaHoc.find({$text: { $search: searchkey }}).populate('GiangVien', 'Ten').populate('TheLoai2','TenTheLoai')
            .skip(perPage*(page-1))
            .limit(perPage)
            .sort({DiemDanhGia:-1})
            .lean();
        }
    }
    const pages = [];       // array of page and status
    for (let i = 0; i < totalPages; i++) {
        pages[i] = {
            value : i + 1 ,
            isActive : (i+1) == page,
        }
    }
    const pagesNav = {};
    if(page > 1){
        pagesNav.prev = Number(page) - 1;
    }
    if(page < totalPages){
        pagesNav.next = Number(page) + 1;
    }
    var i=0;
    for (const item of data) {
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
            data[i].AnhDaiDien = finalFile;
        i++;   
    }
    res.render(`user/search`,{
        layout:'main',
        isAuthentication: req.isAuthenticated(),
        khoahoc : data,
        searchkey : searchkey,
        sortby : sortby,
        page : page,
        pages : pages,
        theloai,
        user: user,
        pagesNav : pagesNav
        });
    db._disconnect();
    
    
});


route.get('/category1/:id', async (req, res) => {
    console.log('category n');
    const page = req.query.page || 1;
    const perPage = 5;
    const id_theloai = req.params.id;
    //const sortby = req.query.sortby || 0;
    db._connect();
    const theloai = await TheLoaiCap1.find().populate('TheLoaiCon').lean();
    const theloai_main = await TheLoaiCap1.findById(id_theloai)
                .populate({path: 'TheLoaiCon', populate: {path:'DSKhoaHoc'}})
                .lean();
    var data = [];
    for(i of theloai_main.TheLoaiCon){
        data = data.concat(i.DSKhoaHoc);
    }
    console.log('data :>> ', data.length);
    totalPages = data.length;
    var user = -1;
    if(req.isAuthenticated()){
        user = await HocVien.findById(req.user._id).lean();
    }
    var start = (page - 1 ) * perPage;
    var end = perPage * page;
    var coursesInPage = data.slice(start,end);
    const numberOfData = data.length;
    totalPages = parseInt(Math.ceil(+numberOfData / perPage ));
    const pages = [];       // array of page and status
    for (let i = 0; i < totalPages; i++) {
        pages[i] = {
            value : i + 1 ,
            isActive : (i+1) == page,
        }
    }
    const pagesNav = {};
    if(page > 1){
        pagesNav.prev = Number(page) - 1;
    }
    if(page < totalPages){
        pagesNav.next = Number(page) + 1;
    }
    var i=0;
    for (const item of coursesInPage) {
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
            coursesInPage[i].AnhDaiDien = finalFile;
        i++;   
    }

    res.render(`user/searchCate`,{
        layout:'main',
        isAuthentication: req.isAuthenticated(),
        khoahoc : coursesInPage,
        //sortby : sortby,
        page : page,
        pages : pages,
        theloai,
        theloai_main,
        user: user,
        pagesNav : pagesNav
        });
    db._disconnect();
});

route.get('/category2/:id', async (req, res) => {
    console.log('search category 2');
    const page = req.query.page || 1;
    const perPage = 5;
    const id_theloai = req.params.id;
    //const sortby = req.query.sortby || 0;
    db._connect();
    const theloai = await TheLoaiCap1.find().populate('TheLoaiCon').lean();
    const theloai_main = await TheLoaiCap2.findById(id_theloai)
                .populate({path:'DSKhoaHoc'})
                .lean();
    var data = theloai_main.DSKhoaHoc;
    console.log('data :>> ', data.length);
    totalPages = data.length;
    var user = -1;
    if(req.isAuthenticated()){
        user = await HocVien.findById(req.user._id).lean();
    }
    var start = (page - 1 ) * perPage;
    var end = perPage * page;
    var coursesInPage = data.slice(start,end);
    const numberOfData = data.length;
    totalPages = parseInt(Math.ceil(+numberOfData / perPage ));
    const pages = [];       // array of page and status
    for (let i = 0; i < totalPages; i++) {
        pages[i] = {
            value : i + 1 ,
            isActive : (i+1) == page,
        }
    }
    const pagesNav = {};
    if(page > 1){
        pagesNav.prev = Number(page) - 1;
    }
    if(page < totalPages){
        pagesNav.next = Number(page) + 1;
    }
    var i=0;
    for (const item of coursesInPage) {
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
            coursesInPage[i].AnhDaiDien = finalFile;
        i++;   
    }

    res.render(`user/searchCate`,{
        layout:'main',
        isAuthentication: req.isAuthenticated(),
        khoahoc : coursesInPage,
        //sortby : sortby,
        page : page,
        pages : pages,
        theloai,
        theloai_main,
        user: user,
        pagesNav : pagesNav
        });
    db._disconnect();
});

module.exports = route;