import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import generarToken from '../helpers/generarToken.js';

const veterinarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    contraseña: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    teléfono: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: generarToken()
    },
    confirmado: {
        type: Boolean,
        default: false
    }
});

// hashear password
veterinarioSchema.pre('save', async function(next) {
    if(!this.isModified('contraseña')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.contraseña = await bcrypt.hash(this.contraseña, salt);
})

// comprobar contraseña
veterinarioSchema.methods.comprobarContraseña = async function(contraseñaFormulario) {
    return await bcrypt.compare(contraseñaFormulario, this.contraseña)
}

const Veterinario = mongoose.model('Veterinario', veterinarioSchema);
export default Veterinario;