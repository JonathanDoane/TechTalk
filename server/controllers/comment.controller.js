const comment = require('../models/comments.model');


module.exports = {

findAllComments: (req, res) => {
    comment.find()
    .then((allComments) => res.json({comments: allComments}))
    .catch(err => res.json({message: "Something went wrong", error: err}));
},
createNewComment: async (req, res) => {
    await comment.create(req.body)
    .then(newlyCreatedComment => res.json({comment: newlyCreatedComment}))
    .catch(err => res.json({message: "Something went wrong", error: err}));
},

findOneSingleComment: (req, res) => {
    comment.findOne({_id: req.params.id})
    .then(oneSingleComment => res.json({comment: oneSingleComment}))
    .catch(err => res.json({message: "Something went wrong", error: err}));
},
updateExistingComment: async (req, res) => {
    await comment.findOneAndUpdate(
        {_id: req.params.id},

        req.body,

        {new: true, runValidators: true}
    )

    .then(updatedComment => res.json({comment: updatedComment}))
    .catch(err => res.json({message: "Something went wrong", error: err}));
},

deleteAnExistingComment: (req, res) => {
    comment.deleteOne({_id: req.params.id})
    .then(result => res.json({result: result}))
    .catch(err => res.json({message: "Something went wrong", error: err}));
}
}