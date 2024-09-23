import bcrypt from "bcrypt"
import jwb from "jsonwebtoken"


//import User model
import { User } from "../Model/UserSchema.js"

const SaltRound = 10

export const login = async (req, resp) => {

    const {
        email,
        password
    } = req.body
    //Finding user based on email from database
    const user = await User.findOne({ email: email })
    //if case user is not found will show error
    if (!user) return resp.status(400).json({ msg: "User not registered!" })
    //Camparing pass with the hashed pass in database
    const correctPassword = await bcrypt.compare(password, user.password)
    //if case passord is incorrect will show error
    if (!correctPassword) return resp.status(400).json({ msg: "Incorrect password!" })
    //get tokken for front end  
    const token = jwb.sign({ user: user.id }, process.env.Json_Secret)
    //deleting password for preventing hack attempts
    user.password = null
    //sending successFully token
    resp.status(201).json({ token, user })
}

export const SignUp = async (req, resp) => {


    const {
        firstName,
        secondName,
        email,
        password,
        image,
    } = req.body

    //Finding user based on email from database
    const user = await User.findOne({ email: email })
    //if case user is not found will show error
    if (user) return resp.status(400).json({ msg: "User already exists with this email please use another one!" })

    //generating hashing for preventing hacks
    const passHashed = await bcrypt.hash(password, 10);

    const newUser = new User({
        firstName,
        secondName,
        email,
        password: passHashed,
        Image: image,
    })

    await newUser.save()
    //get tokken for front end  
    const token = jwb.sign({ user: newUser.id }, process.env.Json_Secret)
    //deleting password for preventing hack attempts
    newUser.password = null
    //sending successFully token
    resp.status(201).json({ token, newUser })
}
//For Adding Friends
export const addFriends = async (req, resp) => {
    try {

        const { friendId,userId } = req.params
// 
        const user = await User.findById(userId)
        const friend = await User.findById(friendId)

            if(user.friends.includes(friend._id))
            {
                user.friends = user.friends.filter((id) => id !== friendId);
                friend.friends = friend.friends.filter((id) => id !== id);
            }
            else
            {
                user.friends.push(friendId)
                friend.friends.push(userId)
            }
       await user.save()
       await friend.save()

       const friends = await Promise.all(
        user.friends.map((id)=>User.findById(id)))
        const formattedFriends = friends.map(({ firstName,secondName,Image,_id })=>{
         return  { firstName,secondName,_id,Image }
        }) 
        resp.status(201).json(formattedFriends)

    } catch (err) {
        console.error(err)
    }

}

export const getUsers = async(req,resp)=>{
    try {
        
        const { userId } = req.params
        const data = await User.find()

        const newData = data.filter((value)=>{
            return value._id!=userId
        })

        // console.log(newData)
        // console.log(newData)
        resp.status(201).json(newData)
    } catch (err) {
        console.error(err)
    }
}

export const getUsersFriends = async(req,resp)=>{
    try {
       const { userId } = req.params

       const user = await User.findById(userId)
       const friends =await Promise.all(
        user.friends.map((id)=>User.findById(id)))
       const formattedFriends = friends.map(({ firstName,secondName,Image,_id })=>{
        return  { firstName,secondName,_id,Image }
       }) 

       resp.status(201).json(formattedFriends)

    } catch (err) {
        console.error(err)
    }
}