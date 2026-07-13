import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";


export const registrarUsuario = async (req, res) => {
  console.log("ENTRO AL CONTROLADOR");

  try {
    console.log("BODY RECIBIDO:", req.body);

    const { nombre, email, password } = req.body;

    console.log("PASSWORD:", password);

    const existe = await Usuario.findOne({ email });

    if (existe) {
      return res.status(400).json({
        mensaje: "El correo ya está registrado",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const usuario = await Usuario.create({
      nombre,
      email,
      password: passwordHash,
    });

    res.status(201).json({
      mensaje: "Usuario creado correctamente",
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
      },
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error del servidor",
    });
  }
};


// AQUÍ empieza otra función independiente
export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;


    const usuario = await Usuario.findOne({ email });


    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      });
    }


    const passwordValida = await bcrypt.compare(
      password,
      usuario.password
    );


    if (!passwordValida) {
      return res.status(401).json({
        mensaje: "Contraseña incorrecta",
      });
    }


    const token = jwt.sign(
      {
        id: usuario._id,
        email: usuario.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );


    res.json({
      mensaje: "Login correcto",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
      },
    });


  } catch (error) {

    console.error("ERROR LOGIN:", error);

    res.status(500).json({
      mensaje: "Error del servidor",
    });
  }
};