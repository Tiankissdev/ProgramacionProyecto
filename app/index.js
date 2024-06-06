import express from "express"

//FIX DIRNAME (A causa del module)
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { methods as authentication} from "./controllers/authentication.controllers.js";

//server
const app = express();
app.set("port",4000)
app.listen(app.get("port"));
console.log("Servidor corriendo en el puerto",app.get("port"));

//Config
app.use(express.static(__dirname + "/public"));
app.use(express.json())


//rutas
app.get("/",(req,res) => res.sendFile(__dirname + "/paginas/login.html"))
app.get("/register",(req,res) => res.sendFile(__dirname + "/paginas/register.html"))
app.get("/admin",(req,res) => res.sendFile(__dirname + "/paginas/admin/admin.html"))
app.post("/api/login",authentication.login)
app.post("/api/register",authentication.register)
