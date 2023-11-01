const { Router } = require("express")
const multer = require('multer')
const uploadConfig = require('../configs/upload')
const UsersController = require("../Controllers/usersController")
const UserAvatarController = require("../Controllers/userAvatarController")
const ensureAuthenticated = require('../middlewares/ensureAuthenticated')
const usersRoutes = Router();
const upload = multer(uploadConfig.MULTER)


const usersController = new UsersController();
const userAvatarController = new UserAvatarController();


usersRoutes.post("/", usersController.create)
usersRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), userAvatarController.update)
usersRoutes.put("/", ensureAuthenticated, usersController.update)
//z




module.exports = usersRoutes;