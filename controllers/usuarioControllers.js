import Usuario from "../models/Usuarios.js";
import { check, validationResult } from "express-validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import Tarea from "../models/Tareas.js";




const formularioLogin = (req, res)=>{
    res.render("login")
};
const autenticarUser = async (req, res)=>{
    await check("email").isEmail().withMessage("Correo Electronico incorrecto").run(req)
    await check("password").notEmpty().withMessage("Contraseña no puede ir vacio").run(req)
    const errores = validationResult(req)
    if(!errores.isEmpty()){
     return res.render("login", {
        errores: errores.array()
    })
    }

    const { email, password } = req.body
    try{
        const usuario = await Usuario.findOne({ where:{email} })
        if(!usuario){ 
            return res.render("login", {
                errores: [{msg: "Email no existente"}]
            })
        }
        const validarPassword = await bcrypt.compare(password, usuario.password)
        if(!validarPassword) {
            return res.render("login", {
                errores: [{msg: "Contraseña incorrecta"}]
            })
        }
        const token = jwt.sign({
            id: usuario.id,
            nombre: usuario.nombre,
        },"secreto", {
            expiresIn: "1d"
        })

        res.cookie("token", token, {
            httpOnly: true,}).redirect("/dashboard")

    }catch(error){
        console.log(error)
    }

};

const formularioRegistro = (req, res)=>{
    res.render("register")
};

  const guardarUsuario = async (req, res)=>{
    await check("nombre").notEmpty().withMessage("El campo de nombre no puede ir vacio").run(req)
    await check("email").isEmail().withMessage("El email no es correcto").run(req)
    await check("password").notEmpty().withMessage("Contraseña no puede ir vacia").run(req)
    await check("password2").equals(req.body.password).withMessage("Las contraseñas no iguales").run(req)
    const errores = validationResult(req)
    if(!errores.isEmpty()){
     return res.render("register", {
        errores: errores.array()
     })
    }

    const { nombre, email, password, password2 } = req.body;
    const existeEmail = await Usuario.findOne({where:{email}})
    if(existeEmail){
      return res.render("register", {
        errores: [{msg:"El email ya existe"}]

    })
    }
    await Usuario.create({nombre, email, password})
    res.redirect("/login")
};

  const formularioRecupeContra = (req, res)=>{
    res.render("recupeContra")
};

const cambiarContraseña = async (req, res)=>{
    await check("email").isEmail().withMessage("Correo Electronico incorrecto").run(req)
    await check("password").notEmpty().withMessage("Contraseña no puede ir vacio").run(req)
    const errores = validationResult(req)
    if(!errores.isEmpty()){
     return res.render("recupeContra", {
        errores: errores.array()
    })
    }

    const { email, password } = req.body;
    const usuario = await Usuario.findOne({where:{email}})
    if(!usuario){
      return res.render("recupeContra", {
        errores: [{msg:"El email ingresado no existe"}]

     })
    }
    usuario.password = await bcrypt.hash(password, 10)
    await usuario.save()
    res.redirect("/login")
};

const cerrarSesion = (req, res)=>{
    return res.clearCookie("token").status(200).redirect("/login")
}

const dashboard = async (req, res) => {
    const {id: usuarioId} = req.usuario
    const tareas = await Tarea.findAll({where:{usuarioId}})
    res.render("dashboard", {
        tareas, usuario: req.usuario.nombre
    })
}

const agregarTarea = async (req, res) =>{
    const {id: usuarioId} = req.usuario
    const {nombre}= req.body
    await Tarea.create({nombre, usuarioId})
    res.redirect("/dashboard")
}



     


export { 
    formularioLogin, 
    formularioRegistro,
    guardarUsuario,
    formularioRecupeContra,
    cambiarContraseña,
    autenticarUser,
    dashboard,
    cerrarSesion,
    agregarTarea
}