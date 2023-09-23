const mongoose = require('mongoose');
const communitySchema = new mongoose.Schema({
    title:{
        type:String,
        required : [true, "Title required" ],
        minlength :[2,'Title must be at least 2 characters' ]
 }, 
 
 post:{
    type:String,
        required : [true, "post required" ],
        minlength :[3,'Post must be at least 3 characters' ]
 }, 

 }
,{ timestamps:true});


module.exports = mongoose.model('Community',communitySchema);

