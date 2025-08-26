const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config();
const app = express();



const { userRouter } = require('./routes/user.js')
const { courseRouter } = require('./routes/course.js')
const { adminRouter } = require('./routes/admin.js')

app.use(express.json());

app.use('/api/v1/user', userRouter);
app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/course', courseRouter);




async function main(){
    await mongoose.connect(process.env.MONGO_URL)
    app.listen(3000, () => {
        console.log(`Server is listening on 3000`)
    })
}
main()

