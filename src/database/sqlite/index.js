const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const path = require('path');

//fazer com que crie o banco de dados assim que a aplicacao rodar

async function sqliteConnection(){
    const database = await sqlite.open({
        //escolhendo o caminho usando path
        filename: path.resolve(__dirname, "..", "database.db"),
        //escolhendo oq vai fazer a coneccao
        driver: sqlite3.Database
    })
    return database
}
module.exports = sqliteConnection
