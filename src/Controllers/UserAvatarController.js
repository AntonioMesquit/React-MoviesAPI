const knex = require('../database/knex');
const DiskStorage = require('../providers/DiskStorage')
const AppError = require('../utils/AppError');

class UserAvatarController {
    async update(request,response) {

        const user_id = request.user.id;
        const diskStorage = new DiskStorage()
        const avatarFileName = request.file.filename

        const user = await knex("users")
        .where({id: user_id}).first()

        if(!user){
            throw new AppError("Somente usuarios logados podem entrar" , 401)
        }
       if(user.avatar){
        await diskStorage.deleteFile(user.avatar)
       }
       const filename = await diskStorage.saveFile(avatarFileName)
       user.avatar = filename

       await knex("users").update(user).where({id: user_id})

       return response.json(user)


        
    }
}
module.exports = UserAvatarController