var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');


//definir esquema
var Schema = mongoose.Schema;


//roles permitidos
var rolPermitido = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: "{VALUE} No es un rol permitido"
}


var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, "el Correo es necesario"] },
    password: { type: String, required: [true, 'La contraseña es necesario'] },
    img: { type: String, required: [false] },
    role: { type: String, required: true, default: "USER_ROLE", enum: rolPermitido }
});
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });
module.exports = mongoose.model('Usuario', usuarioSchema);