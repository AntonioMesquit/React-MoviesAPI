//criar tabela notas

exports.up = knex => knex.schema.createTable("MovieNotes" , table => {
//campo incremental id
table.increments("id");
table.text("title");
table.text("description");
table.integer("rating");
table.integer("user_id").references("id").inTable("users")
table.timestamp("created_at").default(knex.fn.now())
table.timestamp("updated_at").default(knex.fn.now())


})
//executar para utilizar a tabela nova usamos o comando, npx knex migrate:latest

exports.down = knex => knex.schema.dropTable("MovieNotes")
