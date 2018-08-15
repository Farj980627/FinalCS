var passport = require('passport');
var usuario = require('./models/usuarios');

var LocalStrategy = require("passport-local").Strategy;

module.exports = () =>{
   
    passport.serializeUser((usuario,done) => {
        console.log(usuario);
        
        done(null,usuario._id);
    });
    passport.deserializeUser((id,done) => {
        usuario.findById(id,(err,usuario) => {
            done(err,usuario);
        });
    });
};

passport.use("login",new LocalStrategy(function(username,password,done){
 
    usuario.findOne({usuario:username},function(err,usuario){
        if(err){
            return done(err);
        }
        if(!usuario){
            return
            done(null,false,{message:"No existe ningun usuario con ese nombre"})
        }
        usuario.checkPassword(password,(err,isMatch) =>{
            if(err){
                return done(err);
            }
            if(isMatch){
                return done(null,usuario)
            }else{
                return done(null,false,{message:"La contraseñano es valida"})
            }
        })
    })
}));
   