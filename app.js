const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const exphbs = require('express-handlebars');
var express_handlebars_sections = require('express-handlebars-sections');
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const _db = require('./utils/db');

const TheLoaiCap1 = require('./models/schema/TheLoaiCap1.model');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

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
app.get('/',async (req, res) => {
  res.render('user/home');
});

app.use('/admin',express.static('public/admin'));
app.use('/admin/manage-table',express.static('public/admin'));
app.use('/admin',require('./controllers/admin/admin.controller'));


app.listen(port, () => console.log(`Example app listening on port ${port}!`));