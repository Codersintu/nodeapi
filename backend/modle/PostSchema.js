const {Schema,model}=require("mongoose");


const PostSchema = new Schema({
    UserId: {
        type: String,
        required: [true, 'UserId is required'],
      
    },
    desc: {
        type: String,
        max: 500
    },
    img: {
        type: String,
       
    },
    likes: {
        type: Array,
        default: []
    },
  
}, {
    timestamps: true
});

const Post =model('post', PostSchema);
module.exports = Post;
