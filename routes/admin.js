const {Router} = require('express');
const adminRouter = Router()
const {adminModel} = require('../db');
const { z } = require('zod');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


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
        console.log(e);
        return
    }
})

adminRouter.post('/course', function(req, res){
    res.json({
        message : "Signup Endpoint"
    })
})

adminRouter.put('/course', function(req, res) {
    res.json({
        message : "Signup endpoint"
    })
})


adminRouter.get('/course/bulk', function(req, res) {
    res.json({
        message : "Signup endpoint"
    })
})


module.exports = {
    adminRouter : adminRouter
}