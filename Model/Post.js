import mongoose from "mongoose"

const PostSchema = new mongoose.Schema({
    userID : {
        type : String,
        require : true
    },
    userName : {
        type : String,
        require : true
    }
    ,
    userProfileAddress : {
        type : String,
        require : true
    },
    postAddress : {
        type : String,
    },
    Prompt : {
        type : String,
        maxLength : 800
    },
    isPrompt : {
        type : Boolean,
    },
    location : {
        type : String,
        maxLength: 50,
    },
    feeling : {
        type : String,
    },
    Comment : {
        type : Array,
        default : []
    },
    likes : {
        type : Map,
        of : Boolean
    }
})

export const Post = mongoose.model("Post",PostSchema)