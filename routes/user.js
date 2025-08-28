const express = require("express")
const Router = express.Router
const {userModel, purchaseModel, courseModel} = require('../db.js')
const { z } = require('zod');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require("dotenv");
const { userMiddleware } = require("../middleware/user.js");

const userRouter = Router()
dotenv.config();


userRouter.post("/signup", async function(req,res) {
    const requireBody = z.object({
        email: z.string().min(3).max(100).email(),
        password: z.string().min(3).max(100),
        firstName: z.string().min(3).max(100),
        lastName: z.string().min(3).max(100)
    });

    const parsedData = requireBody.safeParse(req.body);

    if(!parsedData.success){
        res.json({
            message : "Incorrect Format",
            error: parsedData.error.message
        })
        return
    }

    const {email, password, firstName, lastName} = req.body

    try{
        const hashedPassword = await bcrypt.hash(password, 10)
        await userModel.create({
            email,
            password: hashedPassword,
            firstName,
            lastName
        })
        res.send({
            message : "Signup Successfull"
        })
    }catch(e){
        res.json({
            message: "Something Went Wrong"
        })
        return
    }
})

userRouter.post("/signin", async function(req,res) {
    const {email, password} = req.body;

    try{
        const user = await userModel.findOne({
            email: email,
        })
    
        const passwordMatch = await bcrypt.compare(password, user.password);
    
        if(user && passwordMatch){
            const token = jwt.sign({
                id: user._id,
            }, process.env.JWT_USER_PASSWORD)
    
        res.send({
            token : token
            })
        }else{
            res.status(403).json({
                message : "Incorrect Password"
            })
        }
    }catch(e){
        res.status(403).json({
            message : "Incorrect Email"
        })
        return
    }
})


userRouter.get("/purchases", userMiddleware , async function(req,res) {
    const userId = req.body.userId

    const purchase = await purchaseModel.find({
        userId,
    })

    const courseData = await courseModel.find({
        _id: {$in: purchase.map(x => x.courseId)}
    })

    res.send({
        purchase,
        courseData
    })
    })

module.exports = {
    userRouter : userRouter
}