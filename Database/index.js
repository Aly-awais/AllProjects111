// const express = require("express")
// const mongoose = require("mongoose")
import express from "express"
import mongoose from "mongoose"

const database = async()=>{
    
    const connect = await mongoose.connect(process.env.mongoose_url)

    console.log(`Database is connected to ${connect.connection.host}`)

}

export default database