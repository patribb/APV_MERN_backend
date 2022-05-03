import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarToken from "../helpers/generarToken.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvideContraseña from "../helpers/emailOlvideContraseña.js";

//& Registro
const registrar = async (req, res) => {
    const { email, nombre } = req.body;
    try {
        // Prevenir registros duplicados
        const existeUsuario = await Veterinario.findOne({ email });
        if (existeUsuario) {
            const error = new Error('Usuario ya registrado')
            return res.status(400).json({ msg: error.message });
        }
        // Guardar nuevo veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        // enviar email
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        });

        return res.status(200).json({ msg: 'Usuario registrado correctamente' });
    } catch (error) {
        console.log(error);
    }
}

//& Autenticar usuario / login
const autenticar = async (req, res) => {
  const { email, contraseña } = req.body;

  // Comprobar si el usuario existe
  const usuario = await Veterinario.findOne({ email });
  if (!usuario) {
    const error = new Error("El Usuario no existe");
    return res.status(404).json({ msg: error.message });
  }
  // Comprobar si el usuario esta confirmado
  if (!usuario.confirmado) {
    const error = new Error("Tu Cuenta no ha sido confirmada");
    return res.status(403).json({ msg: error.message });
  }
  // Revisar el password
  if (await usuario.comprobarContraseña(contraseña)) {
    // Autenticar
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario.id),
    });
  } else {
    const error = new Error("La contraseña es incorrecta");
    return res.status(403).json({ msg: error.message });
  }
};

//& Confirmar usuario creado mediante su token
const confirmar = async (req, res) => {
    const { token } = req.params;
    const usuarioConfirmar = await Veterinario.findOne({ token });

    if (!usuarioConfirmar) {
        const error = new Error('El usuario no existe');
        return res.status(404).json({ msg: error.message })
    }

    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save()
        res.json({ msg: 'Usuario confirmado correctamente' })
    } catch (error) {
        console.log(error);
    }
}

//* Recuperacion de contraseña
//& olvidé mi contraseña
const olvideContraseña = async (req, res) => {
    const { email } = req.body;

    const existeVeterinario = await Veterinario.findOne({ email });
    if (!existeVeterinario) {
        const error = new Error('El email no existe')
        return res.status(400).json({ msg: error.message })
    }

    try {
        existeVeterinario.token = generarToken()
        await existeVeterinario.save();
        // enviar email para recuperar Contraseña
        emailOlvideContraseña({
            nombre: existeVeterinario.nombre,
            email,
            token: existeVeterinario.token
        });
        res.json({ msg: 'Te hemos enviado un e-mail con las instrucciones para reestablecer la contraseña' })
    } catch (error) {
        console.log(error);
    }
}

//& comprobar token
const comprobarToken = async (req, res) => {
    const { token } = req.params.token;
    const tokenValido = await Veterinario.findOne({ token });
    if (tokenValido) {
        res.json({ msg: 'token valido' });
    } else {
        const error = new Error('El token no es válido');
        return res.status(400).json({ msg: error.message });
    }
}

//& obtener nueva contraseña
const nuevaContraseña = async (req, res) => {
    const { token } = req.params;
    const { contraseña } = req.body;

    const veterinario = await Veterinario.findOne({ token });
    if (!veterinario) {
        const error = new Error('Upsss!, algo salió mal...');
        return res.status(400).json({ msg: error.message });
    }

    try {
        veterinario.token = null;
        veterinario.contraseña = contraseña;
        await veterinario.save();
        res.json({ msg: 'Contraseña modificada correctamente' });
    } catch (error) {
        console.log(error);
    }

}

//*---------------------*//

//& Obtener perfil de un usuario
const perfil = async (req, res) => {
    const { veterinario } = req;
    res.json(veterinario);
}

//& Actualizar perfil
const actualizarPerfil = async (req, res) => {
    const veterinario = await Veterinario.findById(req.params.id);
    if(!veterinario) {
        const error = new Error('Upsss!, algo salió mal...');
        return res.status(400).json({ msg: error.message });
    }

    const {email} = req.body;
    if(veterinario.email !== req.body.email) {
        const existeEmail = await Veterinario.findOne({email});
        if(existeEmail) {
            const error = new Error('El email ya esta en uso');
        return res.status(400).json({ msg: error.message });
        }
    }

    try {
        veterinario.nombre = req.body.nombre;
        veterinario.email = req.body.email;
        veterinario.web = req.body.web;
        veterinario.teléfono = req.body.teléfono;

        const veterinarioActualizado = await veterinario.save()
        res.json(veterinarioActualizado);
    } catch (error) {
        console.log(error);
    }
}

//& Actualizar Contraseña
const actualizarContraseña = async (req, res) => {
    // leer los datos
    const { id } = req.veterinario
    const { pwd_actual, pwd_nuevo } = req.body;
    // comprobar que existe el veterinario
    const veterinario = await Veterinario.findById(id);
    if(!veterinario) {
        const error = new Error('Upsss!, algo salió mal...');
        return res.status(400).json({ msg: error.message });
    }
    // comprobar la Contraseña
    if(await veterinario.comprobarContraseña(pwd_actual)) {
            // almacenar nueva Contraseña
            veterinario.contraseña = pwd_nuevo;
            await veterinario.save();
            res.json({ msg: 'Contraseña cambiada con éxito'})
    } else {
        const error = new Error('La contraseña actual no es correcta');
        return res.status(400).json({ msg: error.message });
    }
}

export { registrar, perfil, confirmar, autenticar, olvideContraseña, comprobarToken, nuevaContraseña, actualizarPerfil, actualizarContraseña }