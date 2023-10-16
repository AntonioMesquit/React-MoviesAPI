//rota de login de usuario
//instalar o token , usamos o comando , npm install jsonwebtoken
const knex = require('../database/knex')
const AppError = require('../utils/AppError')
const {compare} = require('bcryptjs')
const authConfig = require('../configs/auth')
const {sign} = require('jsonwebtoken')
class sessionsController{
async create(request,response){
    const {email, password} = request.body;
    // verificar se o email existe no banco de dados
    const user = await knex("users").where({email}).first()
    if(!user){
        throw new AppError("Email/Senha incorreta!" , 401)
    }
    //verificar se a senha digitada e correta

    const passwordMatched = await compare(password, user.password)

    if(!passwordMatched){
        throw new AppError("Email/Senha incorreta!" , 401)
    }

   //criacao do token
    const {secret, expiresIn} = authConfig.jwt

    const token = sign({} , secret, {
        subject: String(user.id),
        expiresIn
    })

     
 



    return response.json({user, token});
}  



}
module.exports = sessionsController;