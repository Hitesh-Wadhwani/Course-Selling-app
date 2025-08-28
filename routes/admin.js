const {Router} = require('express');
const adminRouter = Router()
const {adminModel, courseModel} = require('../db');
const { z } = require('zod');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { adminMiddleware } = require('../middleware/admin.js');


adminRouter.post('/signup', async function(req, res){

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
        await adminModel.create({
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

adminRouter.post('/signin', async function(req,res) {
    const {email, password} = req.body;

    try{
        const admin = await adminModel.findOne({
            email: email,
        })
    
        const passwordMatch = await bcrypt.compare(password, admin.password);
    
        if(admin && passwordMatch){
            const token = jwt.sign({
                id: admin._id,
            }, process.env.JWT_ADMIN_PASSWORD)
    
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

adminRouter.post('/course', adminMiddleware , async function(req, res){

    const adminId = req.userId;

    const {title, description, imageUrl, price} = req.body;

   const course =  await courseModel.create({
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
        creatorId: adminId
    })

    res.json({
        message : "Course Created",
        courseId : course._id
    })
})

adminRouter.put('/course', adminMiddleware ,async function(req, res) {
    const adminId = req.userId;

    const {title, description, imageUrl, price, courseId} = req.body;

   const course =  await courseModel.updateOne({
    _id : courseId,
    creatorId: adminId
   }, {
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
    })

    res.json({
        message : "Course updated",
        courseId : course._id
    })
})


adminRouter.get('/course/bulk', adminMiddleware , async function(req, res) {
    const adminId = req.userId;

   const courses =  await courseModel.find({
    creatorId: adminId
})

    res.json({
        message : "Course updated",
        courses
    })
})


module.exports = {
    adminRouter : adminRouter
}