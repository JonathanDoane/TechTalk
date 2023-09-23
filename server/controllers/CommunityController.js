const Community = require('../models/CommunityPost.model')
 module.exports = {
  createComPost : (req,res)=>{
        console.log("BACK END CREATE", req.body)
        Community.create(req.body)
        //req.body is the form data
        .then(newComPost =>{console.log( "Back End Community Post has been created", req.body); res.status(200).json(newComPost)})
        // if we don't have status(400) when the client req it assume that everything is ok
        .catch(err => {console.log("Something went wrong Back End Create Community Post", err), res.status(500).json(err)})
  },
  getOneCoPost :(req,res)=>{
        Community.findById({_id:req.params.id})
        .then(oneComPost => {console.log(oneComPost);
            res.status(200).json(oneComPost)})
        .catch(err => res.status(400).json(err))
    },
    updateComPost :(req,res)=>{
    console.log("BACK END UPDATED", req.params.id)

       Community.findByIdAndUpdate({_id: req.params.id}, req.body, ({new: true,runValidators: true}))
        .then(updatedComPost =>{console.log("BACK END HAS BEEN UPDATED",updatedComPost) ,res.status(200).json(updatedComPost)})
        .catch(err => { console.log("Something went wrong UPDATE Community Post", err) ;  res.status(400).json(err)})
    }


    
}