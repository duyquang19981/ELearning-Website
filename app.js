const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const exphbs = require('express-handlebars');
var express_handlebars_sections = require('express-handlebars-sections');
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const db = require('./utils/db');
const GiangVien = require('./models/schema/GiangVien.model');
const HocVien = require('./models/schema/HocVien.model');
const Admin = require('./models/schema/Admin.model');
const bcrypt = require('bcrypt');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' })
const passport = require('passport')
                , LocalStrategy = require('passport-local').Strategy;
passport.use('local', new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password'
    },
    async function (username, password, done) {
        db._connect();
        var user =  await HocVien.findOne({ Username: username });
        if(user == null){
          user =  await GiangVien.findOne({ Username: username });
          if(user==null){
            user =  await Admin.findOne({ Username: username });
            if (user==null){
              return done(null, false, { message: 'Username or Pasword is incorect.' });
            }
          } 
        }
        if(!comparePassword(password,user.Password)){
            return done(null, false, { message: ' Pasword is incorect.'  });
        }
        
        return done(null, user);
    }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

const comparePassword = (myPassword, hash) => {
  return bcrypt.compareSync(myPassword, hash);
}

const TheLoaiCap1 = require('./models/schema/TheLoaiCap1.model');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const session = require('express-session')
app.set('trust proxy', 1 );
app.use(session({
	secret: "mysession",
	cookie: {
    // maxAge: 600000 //đơn vị là milisecond,
	},
	saveUninitialized: true,
	resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

var flash = require('connect-flash');
app.use(flash());

app.engine('.hbs', exphbs({
  
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  defaultLayout: 'main',
  helpers:{
    section: express_handlebars_sections(),
  }
  

}));
app.set('view engine', '.hbs');
app.use(express.static('./public'));



app.use('/',require('./controllers/user/Home.controllers'));
app.use('/', express.static('public/admin'))
app.use('/admin', express.static('public/admin'));
app.use('/admin/manage-table',express.static('public/admin'));
app.use('/admin',require('./controllers/admin/admin.controller'));

app.use('/teacher',require('./controllers/teacher/teacher.controller'));
app.use('/teacher', express.static('public/admin'));
app.use('/teacher/profile',express.static('public/admin'));
app.use('/teacher/detailcourse',express.static('public/admin'));
app.use('/teacher/reference',express.static('public/admin'));

require('./middleware/error.mdw')(app);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));