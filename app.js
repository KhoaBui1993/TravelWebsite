const express = require ('express');
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const bcrypt =require('bcryptjs');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();


app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'Helloworld',
    saveUninitialized: true,
    resave: false
}));
app.use(express.static('public'));
app.use(expressLayouts);

app.use(flash());
app.use(function(req,res,next){
    res.locals.message = req.flash();
    next();
})
app.use(fileUpload());
app.use(passport.initialize());
app.use(passport.session());
app.set('layout', './homepage');
app.set('view engine', 'ejs');
const routes = require('./server/routes/travelRoutes');

const { redirect } = require('express/lib/response');
app.use('/', routes);
app.listen(port, ()=> console.log('Listening to port ',port));
