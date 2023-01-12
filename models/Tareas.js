import { DataTypes } from 'sequelize'
import bd from '../config/bd.js'
import Usuario from './Usuarios.js'

const Tarea = bd.define('tareas', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

Tarea.belongsTo(Usuario)
export default Tarea 