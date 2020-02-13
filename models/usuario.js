var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var rolPermitido = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: "{VALUE} No es un rol permitido"
}

var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es Necesario'] },
    email: { type: String, unique: true, required: [true, 'El Correo es Necesario'] },
    password: { type: String, required: [true, 'La Contraseña es Necesario'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolPermitido }
});
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });
module.exports = mongoose.model('Usuario', usuarioSchema);