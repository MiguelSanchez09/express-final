import  express from "express";
import  jwt  from "jsonwebtoken";
import Usuario from "../models/Usuarios.js";
import { agregarTarea, autenticarUser, cambiarContraseña, cerrarSesion, dashboard, formularioLogin, formularioRecupeContra, formularioRegistro, guardarUsuario } from "../controllers/usuarioControllers.js";

async function proteccionRutas (req, res, next){
    const token = req.cookies.token
    if(!token){ 
        return res.redirect("login")
    }
    try { 
        const decodificacion = jwt.verify(token, "secreto")
        const usuario = await Usuario.findOne({where:{id: decodificacion.id}})
        if(usuario){
            req.usuario = usuario
            next()
        }else{
            return res.redirect("login")
        }
    } catch (error) {
        return res.clearCookie("token").redirect("/login")
    }
}


const router = express.Router();
router.get("/login", formularioLogin)
router.post("/login",  autenticarUser)
router.get("/register",  formularioRegistro)
router.post("/register",  guardarUsuario)
router.get("/recupeContra",  formularioRecupeContra)
router.post("/recupeContra",  cambiarContraseña)
router.post("/logout", cerrarSesion)



router.get("/dashboard", proteccionRutas, dashboard)
router.post("/dashboard", proteccionRutas, agregarTarea)









export default router

