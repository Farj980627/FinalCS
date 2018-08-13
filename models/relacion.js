var mongoose= require('mongoose');

var relacionSchema = mongoose.Schema({
    usuario:{type:String,requiere:true},
    nombre:{type:String,requiere:true},
    imagen:{type:String,requiere:true},
    rareza:{type:String,requiere:true}
});

var donothing = () =>{

}
var relacion = mongoose.model("relacion",relacionSchema);
module.exports = relacion;