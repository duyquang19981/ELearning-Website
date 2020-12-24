const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const port = 3000;
const path = require('path');

app.engine('.hbs', exphbs({
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/'),
  defaultLayout: 'main',

}));
app.set('view engine', '.hbs');

app.get('/', (req, res) => {
  res.render('home');
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));