var express = require('express');
var Usuarios = require('./models/usuarios');
var Croma = require('./models/croma');
var relacion = require('./models/relacion');
var passport = require('passport');
var router = express.Router();
var path = require('path');
var acl = require('express-acl');
var webshot = require('webshot');
var percent = require("percent-value");
var dataTime= require('date-time');
var options = {
    siteType: 'file',
    streamType: 'png',
    shotSize: {
        width: 'all',
        height: 'all'
    }
};


acl.config({
    baseUrl: '/',
    defaultRole: 'nohaynadie',
    decodedObjectName: 'usuarios',
    roleSearchPath: 'usuarios.role'
});

router.use(acl.authorize);
router.use((req, res, next) => {
    res.locals.currentUsuarios = req.usuarios;
    res.locals.message = "";
    res.locals.errors = req.flash('error');
    res.locals.infos = req.flash('info');
    if (req.usuarios) {
        req.session.role = req.usuarios.role;
    } else {
        req.session.role = 'nohaynadie';
    }
    console.log(req.session.role);
    next();
});
router.get('/', (req, res, next) => {

    res.render('login');

});

router.get('/cromas', (req, res, next) => {
    Croma.find()
        .sort({ imagen: 'ascending' })
        .exec((err, kroma) => {
            if (err) {
                return next(err);
            }
            res.render('cromas', { kroma: kroma });
            webshot("views/cromas.ejs", "cromas.png", options, (err) => {
                console.log('no entra :c');
                if (err) {
                    return console.log(err);
                }
                console.log('Imagen hecha man');
            });
        });
});


router.get('/registro', (req, res, next) => {
    res.render('registro');
});
router.get('/addcroma', (req, res) => {
    Croma.find()
        .sort({ imagen: 'ascending' })
        .exec((err, kroma) => {
            if (err) {
                return next(err);
            }
            res.render('addcroma', { kroma: kroma, });
        });


});
router.get('/subiruser', (req, res, next) => {
    Usuarios.find({ role: "normal" })
        .exec((err, user) => {
            if (err) {
                return next(err);
            }
            res.render('subiruser', { user: user, });
            console.log(user);

        });


});

router.get('/login', (req, res, next) => {
    

    res.render('login');

});
router.get('/index', (req, res, next) => {
   
    console.log(tiempo);
    res.render('index',{tiempo: tiempo});
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/index');

});
router.get('/my', ensureAuthenticated, (req, res) => {
    relacion.find({ usuario: req.usuarios.usuario })
        .sort({ imagen: 'ascending' })
        .exec((err, croma) => {
            if (err) {
                return next(err);
            }
            var cont = 0;
            var porcentaje;
            croma.forEach((cromas) => {
                cont++;
            }
            )
            console.log(cont);
            porcentaje = percent(cont).of(16);
            console.log(porcentaje);
            res.render('my', { croma: croma, porce: porcentaje });
        });


});
router.post('/registro', (req, res, next) => {
    var usuariov = req.body.usuario;
    var password = req.body.password;
    var email = req.body.email;
    var role = 'normal';



    Usuarios.findOne({ usuario: usuariov }, (err, usuario) => {
        if (err) {
            return next(err);
        }
        if (usuario) {
            req.flash('error', 'El nombre de usuario ya existe');
            return res.redirect('/registro');
        }
        var newUsuario = new Usuarios({
            usuario: usuariov,
            password: password,
            email: email,
            role: role
        });
        newUsuario.save(next);
        return res.redirect('/login')
    });
});
router.post('/subiruser', ensureAuthenticated, (req, res, next) => {
    Usuarios.findOne({usuario: req.body.user}, function (err, usuact){
       
        usuact.role="admin";
        usuact.save(next);


    });
    return res.redirect('/index')
   
});

router.post('/addcroma', ensureAuthenticated, (req, res, next) => {

    var usuariov = req.usuarios.usuario;

    var nombrev = req.body.nombre;
    relacion.findOne({ nombre: nombrev, usuario: usuariov }, function (err, nombrecroma1) {
        if (nombrecroma1 == null) {
            Croma.findOne({ nombre: req.body.nombre }, function (err, nombrecroma) {

                var imagenv = nombrecroma.imagen;
                var rarezav = nombrecroma.rareza;
                var newRelacion = new relacion({
                    usuario: usuariov,
                    nombre: nombrev,
                    imagen: imagenv,
                    rareza: rarezav
                });
                newRelacion.save(next);

            });
            return res.redirect('/my')
        }
        else {
            return res.redirect('/addcroma')
        }
    });
});
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash('info', 'necesitas iniciar sesion para acceder a esta zona');
        res.redirect('/login');
    }
}
router.post('/login', passport.authenticate('login', {
    successRedirect: '/cromas',
    failureRedirect: '/login',
    failureFlash: true
}));

module.exports = router;