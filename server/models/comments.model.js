const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    content:{
        type:String,
        required:[true, "Comment is required for submission"],
        minLength: [3, "Content must be at least 3 characters long"],
    },
    user_name:{
        type:String,
    },
    date:{
        type:Date,
    },
    
} , { timestamps:true });

module.exports = mongoose.model('Comment', commentSchema);