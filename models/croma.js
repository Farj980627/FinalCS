var mongoose= require('mongoose');

var cromaSchema = mongoose.Schema({
    nombre:{type:String,requiere:true},
    imagen:{type:String,requiere:true},
    rareza:{type:String,requiere:true}
});

var donothing = () =>{

}
var Croma = mongoose.model("Croma",cromaSchema);
module.exports = Croma;