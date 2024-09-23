import mongoose,{ ObjectId } from "mongoose"
import { Post } from "../Model/Post.js"

//Create Post Controller this will create a new post
export const createPost = async(req,resp)=>{
    try {
        const { 
            userID,
            userProfileAddress,
            postAddress,
            location,
            feeling,
            Comment,
            likes,
            Prompt,
            firstName,
            secondName,
            isPrompt
         } = req.body

         let newPost

         if(isPrompt)
         {
            newPost = new Post({
                userName : firstName+" "+secondName,
                userID : userID,
                userProfileAddress : userProfileAddress,
                Prompt : Prompt,
                Comment:[],
                likes:{},
            })
         }
         
         else
         {
            if(!(userID,userProfileAddress,postAddress))
         {
            resp.status(401).json("Please provide the necessary information")
         }
            newPost = new Post({
            userID,
            userName : firstName+" "+secondName,
            userProfileAddress,
            postAddress,
            Prompt,
            location,
            feeling,
            Comment:[],
            likes:{},
         })
         }
         
    
         await newPost.save()
         const postfeed = await Post.find()
         resp.status(201).json({postfeed,msg:"Posted!"})
    } catch (err) {
        console.error(err)
    }

}
//LIke Post Controller this will add or remove existing post
export const likePost = async(req,resp)=>{
try {

    
    const { id } = req.params
    const { userId } = req.body

    const requiredPost = await Post.findById(id)

    if(!requiredPost)
    {
        resp.status(401).send("Post No Longer Exists")
    }

    const isLiked = requiredPost.likes.get(userId)

    if(!isLiked)
    {
        requiredPost.likes.set(userId,true)
    }
    else{
        requiredPost.likes.delete(userId)
    }

    const renewPost = await Post.findByIdAndUpdate(
        id,
        {likes : requiredPost.likes},
        {new : true }
    )

    resp.status(201).json(renewPost)
} catch (err) {
    console.error(err)
}

}
//Controller this will return all the post existing in Database
export const getFeedPost = async(req,resp)=>{
    try {

        const feedPost = await Post.find()

        if(!feedPost)
        {
            resp.status(401).json("There is no Post Availabe yet")
        }

        resp.status(201).json(feedPost)

    } catch (err) {
        console.error(err)
    }
}
//Controller this will show specific user Posts 
export const getUserPost = async(req,resp)=>{
    try {

        const { userID } = req.params
        
    const userfeedPosts = await Post.find({userID:userID})

    if(!userfeedPosts)
    {
        resp.status(401).json("User Dont have any posts")
    }
    resp.status(201).json(userfeedPosts)
    } catch (err) {
        console.error(err)
    }


}
//Controller this will add or remove comments from a Posts
export const getPostComment = async(req,resp)=>{
    try {

        const { id } = req.params
        const { userID,Comment,userName,userPicAddress } = req.body

        const post = await Post.findById(id)
        post.Comment.push({"Comment":Comment,"userID":userID,"userName":userName,"userPicAddress":userPicAddress})

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {Comment:post.Comment},
            { new : true }
        )

        resp.status(201).json(post)

    } catch (err) {
        console.error(err)
    }
}

export const getPromptChange = async(req,resp)=>{
    try {

        const { id } = req.params
        const { userID,Prompt } = req.body

        const post = await Post.findById(id)
        post.Prompt = Prompt

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {Prompt:post.Prompt},
            { new : true }
        )

        resp.status(201).json(post)

    } catch (err) {
        console.error(err)
    }
}


