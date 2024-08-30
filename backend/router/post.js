const Post = require("../modle/PostSchema");

const router=require("express").Router();

//create  post
router.post("/",async(req,res)=>{
    const newpost=new Post(req.body)
    try {
        const savedPost=await newpost.save();
        res.status(200).json("saved post successfully")
    } catch (error) {
        res.status(500).json(error)
    }
    
})

//update  post
router.put("/:id",async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id)
        if (post.UserId == req.body.UserId) {
            await post.updateOne({$set: req.body})
            res.status(200).json('updated')
        }else{
            res.status(500).json("you update only self account")
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

//delete post
router.delete("/:id",async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id)
        if (post.UserId == req.body.UserId) {
            await post.deleteOne()
            res.status(200).json('deleted')
        }else{
            res.status(500).json("you delete only self account")
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

//like and dislike a post
router.put("/:id/like", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post.likes.includes(req.body.UserId)) {
        await post.updateOne({ $push: { likes: req.body.UserId } });
        res.status(200).json("The post has been liked");
      } else {
        await post.updateOne({ $pull: { likes: req.body.UserId } });
        res.status(200).json("The post has been disliked");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });
  //get a post
  
  router.get("/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.status(200).json(post);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //timeline

  router.get("/timeline/all", async (req, res) => {
    try {
      const currentUser = await User.findById(req.body.UserId);
      const userPosts = await Post.find({ UserId: currentUser._id });
      const friendPosts = await Promise.all(
        currentUser.followings.map((friendId) => {
          return Post.find({ UserId: friendId });
        })
      );
      res.json(userPosts.concat(...friendPosts))
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports=router;