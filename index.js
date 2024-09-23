import express, { Router } from "express" // const express = require("express")
import dotenv from "dotenv" //const dotenv = require("dotenv")
import morgan from "morgan"
import cors from "cors"
import helmet from "helmet"
import bodyParser from "body-parser"
import multer from "multer"
import path from "path"
import { fileURLToPath } from "url";
//Importing Files
import database from "./Database/index.js"
import { login,SignUp,getUsers,addFriends, getUsersFriends } from "./Controller/UserConfiguration.js"
import { createPost,getFeedPost,getPostComment,likePost,getUserPost } from "./Controller/Post.js"

//Takking instances
const app = express()

const _fileName = fileURLToPath(import.meta.url)
const _dirName = path.dirname(_fileName)
app.use(morgan("common"))
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({"policy":"cross-origin"}))
app.use(bodyParser.json({
    limit : "30mb",
    extended : true
}))
app.use(bodyParser.urlencoded({
    limit : "30mb",
    extended : true
}))
app.use(cors())
app.use("/assets",express.static(path.join(_dirName,"/Assets/UserProfile")))

const storage = multer.diskStorage({
    destination : function (req, file, cb) {
        cb(null, "Assets/UserProfile");
      },
    
      filename: function (req, file, cb) {
        cb(null, file.originalname);
      },
})

const upload = multer({storage})

//FileConfiguration
dotenv.config({path:"./config/.env"})

// import userAuth from "./Routes/auth.js"


//DatabaseConnection
database()

//Cross origin
// app.use(crossOriginIsolated)

//Port Configuration
const port = process.env.Port || 6000

//Routing
//Routing for Profile Image and Creating post
app.post("/auth/signUp",upload.single("Picture"),SignUp)
app.post("/posts/createPost",upload.single("image"),createPost)
// app.use("/authentication",userAuth)
app.post("/auth/login",login)

app.get("/User/getUserFriends/:userId",getUsersFriends)
app.get("/User/:userId",getUsers)
app.get("/posts/allPost",getFeedPost)
app.get("/posts/:userID",getUserPost)
app.patch("/posts/:id/like",likePost)
app.patch("/addFriends/:friendId/:userId",addFriends)
app.put("/posts/Comments/:id",getPostComment)

app.listen(process.env.Port,console.log(`App is listening on Port ${port}`))