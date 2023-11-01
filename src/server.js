
require("dotenv/config")
require("express-async-errors")
//instalar o cors ,para o front end conseguir fazer requisicoes para o back, npm install cors
const cors = require('cors')
const AppError = require("./utils/AppError")
const express = require("express")
const routes = require("./routes")
const uploadConfig = require("./configs/upload")
//instalamos o knex, para ser o nosso query builder usando npm install kex
//para abrimos a configuracao dele usamos npx knex init

//para trabalhar com requisicoes http, instalar o npm install axios no front end
const migrationsRun = require("./database/sqlite/migrations")
const app = express();
app.use(cors())
app.use(express.json())

app.use("/files" , express.static(uploadConfig.UPLOADS_FOLDER))
app.use(routes)
migrationsRun() 
// fazer a criacao da database automatica

app.use((error, request, response, next) => {
 //verificar se foi erro por parte do cliente
 if(error instanceof AppError) {
    return response.status(error.statusCode).json({
        status: "error",
        message: error.message,
    })
 }

 // debugar o erro
console.error(error)

//verificar se o erro foi do servidor
return response.status(500).json({
    status: "error",
    message: "Erro interno do servidor"
})


});
const PORT = process.env.SERVER_PORT || 3000

app.listen(PORT, () => console.log(`Estamos rodando na porta ${PORT}`));



