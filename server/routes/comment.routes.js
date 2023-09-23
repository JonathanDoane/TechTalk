const CommentController = require('../controllers/comment.controller');

module.exports = (app) => {
        
        app.get('/api/comment', CommentController.findAllComments);
    
        app.post('/api/comment', CommentController.createNewComment);
    
        app.get('/api/comment/:id', CommentController.findOneSingleComment);
    
        app.patch('/api/comment/:id', CommentController.updateExistingComment);
    
        app.delete('/api/comment/:id', CommentController.deleteAnExistingComment);
    
    }