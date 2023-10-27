//importamos o hash do bcrypt para criptografar
const {hash , compare} = require("bcryptjs")
const AppError = require("../utils/AppError")
const sqlConnection = require("../database/sqlite");


class usersControllers {
async create(request, response) {
const { name, email, password } = request.body;
//conectar com o banco de dados
const database = await sqlConnection()

//verificar se ja existe um email igual na hora da criacao do usuario
const checkUserExist = await database.get("SELECT * FROM USERS WHERE email = (?) " , [email])
 
if(checkUserExist){
    throw new AppError("O email ja esta em uso!")

}
// hash para gerar a criptografia da senha
const hashedPassword = await hash(password, 8)

await database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)" , [name, email, hashedPassword])
// instalar o bcryptjs para criptografar as senhas! npm install bcryptjs


return response.status(201).json()

}
async update(request,response){
    const {name, email, password, old_password} = request.body;
    const user_id = request.user.id

    const database = await sqlConnection()
    const user = await database.get("SELECT * FROM users WHERE id = (?)" , [user_id])

    if(!user){
        throw new AppError("Usuario nao encontrado")
    }

    const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)" , [email]);

    //verificacao de mudar email para algum que ja existe 
    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
        throw new AppError("Este email ja esta em uso!")
    }


    user.name = name ?? user.name;
    user.email = email ?? user.email;
    if(password && !old_password){
        throw new AppError("Digite sua senha antiga para atualizar a senha!" )
    }
    //comparar a senha nova e a antiga para atualizar
    if(password && old_password){
        const checkOldPassword = await compare(old_password, user.password)
        if(!checkOldPassword){
            throw new AppError("Senha antiga invalida!")
        }
        user.password = await hash(password, 8)
    }

    await database.run(`
    UPDATE users SET
    name = ?,
    email = ?,
    password = ?,
    updated_at = DATETIME('now')
    WHERE id = ?`,
    [user.name, user.email, user.password, user_id]
  )
    return response.json();

}
}
module.exports = usersControllers