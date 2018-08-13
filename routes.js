var express = require('express');
var Usuarios = require('./models/usuarios');
var Croma = require('./models/croma');
var relacion = require('./models/relacion');
var passport = require('passport');
var router = express.Router();
var path = require('path');
var acl = require('express-acl');

/*acl.config({
    baseUrl:'/',
    defaultRole: 'Normal',
    decodedObjectName:'usuarios', 
    roleSearchPath: 'usuarios.rol'
});

router.use(acl.authorize);*/


router.get('/cromas', (req, res, next) => {
    Croma.find()
        .sort({ imagen: 'ascending' })
        .exec((err, kroma) => {
            if (err) {
                return next(err);
            }
            res.render('cromas', { kroma: kroma });
        });
});
router.get('/my', (req, res, next) => {
    relacion.find()
        .sort({ usuario: 'ascending' })
        .exec((err, croma) => {
            if (err) {
                return next(err);
            }
            res.render('my', { croma: croma });
        });
});
router.use((req, res, next) => {
    res.locals.currentUsuario = req.usuario;
    res.locals.errors = req.flash('error');
    res.locals.infos = req.flash('info');
    if (req.usuario) {
        req.session.role = req.usuario.rol;

    } else {
        req.session.role = 'Normal';
    }

    next();
});
router.get('/registro', (req, res, next) => {
    res.render('registro');
});

router.get('/login', (req, res, next) => {
    res.render('login');
});
router.get('/index', (req, res, next) => {
    res.render('index');
});
router.get('/', (req, res, next) => {
});
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/index');

});
router.get('/my', ensureAuthenticated, (req, res) => {
    res.render('my');
});



router.get('/addcroma', (req, res) => {
    Croma.find()
        .sort({ imagen: 'ascending' })
        .exec((err, kroma) => {
            if (err) {
                return next(err);
            }
            res.render('addcroma', { kroma: kroma });
            
        });
});


router.post('/registro', (req, res, next) => {
    var usuariov = req.body.usuario;
    var password = req.body.password;
    var role = 'Normal';



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
            rol: role
        });
        newUsuario.save(next);
        return res.redirect('/login')
    });
});

router.post('/addcroma', ensureAuthenticated, (req, res, next) => {
    var usuariov = user;    
    var nombrev = req.body.nombre;
    console.log(user);
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
    
    successRedirect: '/addcroma',
    failureRedirect: '/login',
    failureFlash: true
}));

module.exports = router;