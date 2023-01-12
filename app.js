import express  from "express";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import bd from "./config/bd.js"
import cookieParser from "cookie-parser";


const app = express();

app.use(express.urlencoded({extended: true}));
app.use(cookieParser())

try {
    await bd.authenticate()
    bd.sync()
    console.log("Conexión correcta")
} catch (error) {
    console.log(error)
};

app.set("view engine", "ejs");
app.set("views", "./views");

app.use("/", usuarioRoutes);
const port = 3000;

app.listen(port, ()=>{
    console.log(`Servidor corriendo en el puerto ${port}`);
});



