import { DataTypes } from "sequelize"
import bcrypt  from "bcrypt"
import bd from "../config/bd.js"

const Usuario = bd.define("usuarios", {
    nombre:{
        type: DataTypes.STRING,
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    hooks:{
        beforeCreate: async function(usuario) {
            usuario.password = await bcrypt.hash(usuario.password, 10)
  }
 }
})

export default Usuario