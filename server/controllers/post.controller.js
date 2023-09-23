const post = require('../models/posts.model')
const User = require('../models/users.model');
const jwt = require('jsonwebtoken');

module.exports = {
    findAllPosts: (req, res) => {
        post.find()
            .then((allPosts) => res.json({ posts: allPosts }))
            .catch(err => res.json({ message: "Something went wrong", error: err }));
    },
    createNewPost: async (req, res) => {
        console.log("Received a request to create a new post");
        console.log("Request body:", req.body);
        const token = req.cookies.userToken;
        console.log("token",token)
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        console.log("decoded",decoded)
        
        try {
            const newlyCreatedPost = await post.create({...req.body,user:decoded._id});
        
            console.log("New post created:", newlyCreatedPost);
            res.json({ post: newlyCreatedPost });
        } catch (err) {
            console.error("Error creating post:", err);
            res.status(400).json({ message: "Something went wrong", error: err });
        }
    }
    ,

    findOneSinglePost: (req, res) => {
        post.findOne({ _id: req.params.id })
            .then(oneSinglePost => res.json({ post: oneSinglePost }))
            .catch(err => res.json({ message: "Something went wrong", error: err }));
    },


    updateExistingPost: async (req, res) => {
        await post.findOneAndUpdate(
            { _id: req.params.id },

            req.body,

            { new: true, runValidators: true }
        )

            .then(updatedPost => res.json({ post: updatedPost }))
            .catch(err => res.json({ message: "Something went wrong", error: err }));
    },

    deleteAnExistingPost:  (req, res) => {
        post.deleteOne({ _id: req.params.id })
            .then(result => res.json({ result: result }))
            .catch(err => res.json({ message: "Something went wrong", error: err }));
    }

}