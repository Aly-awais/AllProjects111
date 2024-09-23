import mongoose from "mongoose"

const userSchema = new mongoose.Schema({

    firstName : {
        type : String,
        require : true
    },
    secondName : {
        type : String,
        require : true
    },
    email : {
        type : String,
        require : true,
        unique : true
    },
    password : {
        type : String,
        require : true
    },
    Image : {
        type : String,
        require : true
    },
    Bio : {
        type : String,
        maxLength: 200,
    },
    location : {
        type : String,
        maxLength: 50,
    },
    friends : {
        type : Array,
        default : []
    }
})

export const User = mongoose.model("User",userSchema)

