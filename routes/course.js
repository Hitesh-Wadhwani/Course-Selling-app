const express = require("express")
const { userMiddleware } = require("../middleware/user")
const { purchaseModel, courseModel } = require("../db")
const Router = express.Router

const courseRouter = Router()

    courseRouter.post("/purchase", userMiddleware, async function(req,res) {

        const userId = req.body.userId;
        const courseId = req.body.courseId

        await purchaseModel.create({
            userId,
            courseId
        })

        res.send({
            message : "You have successfully bought the course"
        })
    })

    courseRouter.get('/preview', async function(req,res) {
        const course = await courseModel.find({})
        res.json({
            course
        })
    })

module.exports = {
    courseRouter: courseRouter
}