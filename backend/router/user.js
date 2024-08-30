const User =require("../modle/userSchema")
const bcrypt=require("bcrypt")
const router=require("express").Router();

//update user
router.put("/:id",async(req,res)=>{
    if (req.body.UserId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt=await bcrypt.genSalt(10);
                req.body.password=await bcrypt.hash(req.body.password,salt)
            } catch (e) {
                return res.status(500).json(e)
            }
        }

        try {
            const user =await User.findByIdAndUpdate(req.params.id,{
                $set:req.body
            });
            res.status(200).json("Account has been updated");
        } catch (e) {
            return res.status(500).json(e)
        }
    } else{
        return res.status(403).json("you can update only your account")
    }
});
//delete user
router.delete("/:id",async(req,res)=>{
    if (req.body.UserId === req.params.id || req.body.isAdmin) {
       

        try {
            const user =await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted");
        } catch (e) {
            return res.status(500).json(e)
        }
    } else{
        return res.status(403).json("you can delete only your account")
    }
});
//get a user
router.get("/:id",async(req,res)=>{
    try {
        const user=await User.findById(req.params.id);
         const {password,updatedAt,...other}=user._doc
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error)
    }
})

//followers user

router.put("/:id/follow",async(req,res)=>{
    if (req.body.UserId !== req.params.id) {
        try {
            const user=await User.findById(req.params.id);
            const currentuser=await User.findById(req.body.UserId)
            if (!user.followers.includes(req.body.UserId)) {
                await user.updateOne({$push:{followers:req.body.UserId}})
                await currentuser.updateOne({$push:{following:req.params.id}})
                res.status(200).json("user has been followed")
            } else {
                res.status(403).json("you already follow user")
            }
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        return res.status(403).json('self follow')
    }
})

//unfollow user

router.put("/:id/unfollow",async(req,res)=>{
    if (req.body.UserId !== req.params.id) {
        try {
            const user=await User.findById(req.params.id);
            const currentuser=await User.findById(req.body.UserId)
            if (user.followers.includes(req.body.UserId)) {
                await user.updateOne({$pull:{followers:req.body.UserId}})
                await currentuser.updateOne({$pull:{following:req.params.id}})
                res.status(200).json("user has been unfollowed")
            } else {
                res.status(403).json("you dont follow user")
            }
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        return res.status(403).json('you cant unfollow self')
    }
})


module.exports=router;