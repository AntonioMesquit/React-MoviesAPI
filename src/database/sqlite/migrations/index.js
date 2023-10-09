const sqlConnection = require("../../sqlite")

const createUsers = require("./createUsers")

async function migrationRun(){
    // criar tabelas, colocar dentro as tabelas que eu quero criar
    const schemas = [

    createUsers

    ].join("") // remover espacos
    sqlConnection().then  
    (db => db.exec(schemas)
    .catch(error => console.log(error)))
}

module.exports = migrationRun