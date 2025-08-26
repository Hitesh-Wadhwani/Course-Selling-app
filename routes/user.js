const express = require("express")
const Router = express.Router

const userRouter = Router()

    userRouter.post("/signup", function(req,res) {
        res.send({
            message : "Signup endpoint"
        })
    })

    userRouter.post("/signin", function(req,res) {
        res.send({
            message : "Signup endpoint"
        })
    })


    userRouter.get("/purchases", function(req,res) {
        res.send({
            message : "Signup endpoint"
        })
    })

module.exports = {
    userRouter : userRouter
}