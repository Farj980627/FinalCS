var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var routes = require('./routes');
var passportsetup = require ("./passportsetup");
var app = express();
 mongoose.connect('mongodb://localhost:27017/finalcromas');


 passportsetup();


app.set('port',process.env.PORT || 3000);

app.set('views',path.resolve(__dirname,'views'));
app.set('view engine',"ejs");

app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(session({
    secret:"ALOLF#$#",
    resave:true,
    saveUninitialized:true
}));
app.use(flash());

app.use(passport.initialize({
    userProperty:"usuarios"
}));

app.use(passport.session());

app.use(routes);

var publicPath= path.resolve(__dirname, 'public');
app.use('/public', express.static(publicPath));

app.listen(app.get("port"),() =>{
    console.log("la aplicacion inicio por el puerto"+app.get("port"));
});