import mongoose from "mongoose";
import Paciente from "../models/Paciente.js";

//& Crear un nuevo paciente
const nuevoPaciente = async (req, res) => {
  //const { nombre, propietario, email, sintomas } = req.body;
  const paciente = new Paciente(req.body);
  paciente.veterinario = req.veterinario._id;
  try {
    const pacienteGuardado = await paciente.save();
    res.json(pacienteGuardado);
  } catch (error) {
    console.log(error);
  }
}

//& Obtener listado de pacientes
const obtenerPacientes = async (req, res) => {
  const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario);
  res.json(pacientes);
}

//& Obtener un paciente
const obtenerPaciente = async (req, res) => {
  // console.log(req.params.id);
  const {id} = req.params;
  const paciente = await Paciente.findById(id);
  if(!paciente) {
    res.status(400).json({msg: 'Paciente no encontrado'})
  }
  if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
    return res.json({msg: 'Solo puedes acceder a tus pacientes'});
  }
  res.json(paciente) 
}

//& Actualizar paciente
const actualizarPaciente = async (req, res) => {
  const { veterinario, ...resto } = req.body;
  const {id} = req.params;

  const paciente = await Paciente.findByIdAndUpdate(id, resto);
  if(!paciente) {
    res.status(400).json({msg: 'Paciente no encontrado'})
  }
  if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
    return res.json({msg: 'Solo puedes modificar tus pacientes'});
  }
  const pacienteActualizado = paciente.save();
  res.json({pacienteActualizado})
}

//& Eliminar paciente
const eliminarPaciente = async (req, res, err) => {
   const { id } = req.params;

   if(!mongoose.Types.ObjectId.isValid(id)) {
     const error = new Error('Id no valido');
     return res.status(403).json({msg: error.message});
   }

   const paciente = await Paciente.findById(id);

   if(!paciente) {
     const error = new Error('Paciente no encontrado');
     return res.status(403).json({msg: error.message});
   }

   if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
     const error = new Error('Acción no válida');
     return res.status(403).json({msg: error.message});
   }

   try {
     await paciente.deleteOne();
     res.json({msg: 'Paciente eliminado'})
   } catch (error) {
     log(error)
   }
}

export {nuevoPaciente, obtenerPacientes, obtenerPaciente, actualizarPaciente, eliminarPaciente}