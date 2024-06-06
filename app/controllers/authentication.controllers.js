import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();

const usuarios = [{
    user: "tiago",
    email: "tiago200205@gmail.com",
    password: "$2a$05$RUJWMbkBwqB8CJR.4mWbHu3db3gRNOP/E3ybYBhTQV8JL58qv7KyS" //"tiago"
}]


async function login(req,res){
    console.log(req.body)
    const user = req.body.user;
    const password = req.body.password;
    if (!user || !password){
        return res.status(400).send({status:"Error",message:"Los campos estan incompletos"}) /*Manejo de falta de campos*/
       } 

       const usuarioduplicado = usuarios.find(usuario => usuario.user === user);
       if(!usuarioduplicado){
        return res.status(400).send({status:"Error",message:"Error durante el login"}) /*Manejo de duplicados*/
       }
       const loginCorrecto = await bcryptjs.compare(password, usuarioduplicado.password);
       if(!loginCorrecto){
        return res.status(400).send({status:"Error",message:"Error durante el login"}) /*Manejo de duplicados*/
       }
       const token = jsonwebtoken.sign(
        {user:usuarioduplicado.user},
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXP});
    
        const cookieOption = {
          expires: new Date(Date.now() + process.env.JWT_COOKIE_EXP * 24 * 60 * 60 * 1000),
          path: "/"
        }
        res.cookie("jwt",token,cookieOption);
        res.send({status:"ok",message:"Usuario loggeado",redirect:"/admin"});  

}

async function register(req,res){
   
   const user = req.body.user;
   const password = req.body.password;
   const email = req.body.email;

   if (!user || !password || !email){
    return res.status(400).send({status:"Error",message:"Los campos estan incompletos"}) /*Manejo de falta de campos*/
   } 

   const usuarioduplicado = usuarios.find(usuario => usuario.user === user);
   if(usuarioduplicado){
    return res.status(400).send({status:"Error",message:"Este usuario ya existe"}) /*Manejo de duplicados*/
   }
   
   const salt = await bcryptjs.genSalt(5);  /*Proceso para encriptar mutuamnete*/
   const hashPassword = await bcryptjs.hash(password,salt)
   const nuevoUsuario = {
    user, email, password: hashPassword
   } 
   
    usuarios.push(nuevoUsuario);
    console.log(usuarios);
    return res.status(201).send({status:"ok",message:"Usuario Agregado",redirect:"/"})
}

export const methods = {
    login,
    register

}