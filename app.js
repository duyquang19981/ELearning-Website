const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const port = 3000;
const path = require('path');

app.engine('.hbs', exphbs({
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  defaultLayout: 'main',

}));
app.set('view engine', '.hbs');
app.use(express.static('./public'));
app.get('/', (req, res) => {
  res.render('user/home');
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));