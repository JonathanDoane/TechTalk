const CommunityPostController = require('../controllers/CommunityController')
module.exports = app =>{

    app.post('/api/create',CommunityPostController.createComPost)
    app.get('/api/one/:id', CommunityPostController.getOneCoPost)
    app.patch('/api/update/:id', CommunityPostController.updateComPost)

}

