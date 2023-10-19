const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class NotesController {
  async create(request, response) {
    const { title, description, rating, tags } = request.body;
    const user_id = request.user.id
  

   if(rating < 1 || rating > 5){
    throw new AppError("A nota deve ser apenas entre 1 e 5")
   }

    const [note_id ]= await knex("MovieNotes").insert({
      title,
      description,
      rating,
      user_id
    });

    const tagsInsert = tags.map(name => {
        return {
          note_id,
          name,
          user_id
        }
      })

    await knex("tags").insert(tagsInsert);

    return response.json();
  }
  async show(request, response) {
   //fncao para mostrar a nota criada
    const {id} = request.params;
   
    const note = await knex("MovieNotes").where({id}).first()
    //pesquisar notas por ordem alfabetica
    const tags = await knex("tags").where({note_id: id}).orderBy("name")
   
    return response.json({
        ...note,
         tags
    });

  }
  async delete(request, response){
    const {id} = request.params

    await knex("MovieNotes").where({id}).delete()

    return response.json()
  }
  async index(request, response){
    const { title, tags} = request.query;
    const user_id = request.user.id
    let notes

    if(tags){
      //pesquisar por virgula, usamos o map apenas para rodar as tags
     const filterTags = tags.split(',').map(tag => tag.trim())
     notes = await knex("tags")
     .select([
      "MovieNotes.id",
      "MovieNotes.title",
      "MovieNotes.user_id"
     ])
     .where("MovieNotes.user_id" , user_id)
     .whereLike("MovieNotes.title" , `%${title}%`)
     //pesquisar para ver a nota atravez da comparacao do array
     .whereIn("name", filterTags)
     .innerJoin("MovieNotes", "MovieNotes.id" , "tags.note_id")
    }
    else{    
    notes =  await knex("MovieNotes") 
    .where({user_id}) //filtrar por usuario
    .whereLike("title", `%${title}%`) // pesquisar pelo nome, % antes e depois para
    .orderBy("title") //ordem por titulo
    }
    const userTags = await knex("tags").where({user_id})
    const notesWithTags =   notes.map(note => {
      const noteTags = userTags.filter(tag => tag.note_id === note.id)

      return {
        ...note,
        tags: noteTags
      }
    })
    return response.json(notesWithTags)
  }
}

module.exports = NotesController;
