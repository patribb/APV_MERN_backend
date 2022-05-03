import nodemailer from 'nodemailer';

const emailOlvideContraseña = async (data) => {
  const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const { email, nombre, token } = data;

// enviar el email
const info = await transporter.sendMail({
  from: 'APV - Administrador de Pacientes Veterinarios',
  to: email,
  subject: 'Reestablece tu contraseña',
  text: 'Reestablece tu contraseña',
  html: `<p>Hola: ${nombre}, has solicitado reestablecer tu contraseña.</p>
      <p>Puedes generar una nueva contraseña haciendo click en el siguiente enlace:
      <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Resstablecer contraseña</a></p>
      <p>Si no has solicitado un cambio de contraseña puedes ignorar este mensaje.</p>
  `
});
console.log('Mensaje enviado: %s', info.messageId);
}

export default emailOlvideContraseña;