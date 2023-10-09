require("express-async-errors")
const AppError = require("./utils/AppError")
const express = require("express")
const routes = require("./routes")
//instalamos o knex, para ser o nosso query builder usando npm install kex
//para abrimos a configuracao dele usamos npx knex init

const migrationsRun = require("./database/sqlite/migrations")
const app = express();
app.use(express.json())
app.use(routes)
migrationsRun() // fazer a criacao da database automatica

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
const PORT = 3333

app.listen(PORT, () => console.log(`Estamos rodando na porta ${PORT}`));


