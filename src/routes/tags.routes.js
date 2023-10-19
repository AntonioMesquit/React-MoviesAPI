const {Router} = require("express")
const TagsController = require("../Controllers/tagsController")
const ensureAuthenticated = require('../middlewares/ensureAuthenticated')

const tagsRoutes = Router();

const tagsController = new TagsController();

tagsRoutes.get("/" , ensureAuthenticated, tagsController.index)


module.exports = tagsRoutes;