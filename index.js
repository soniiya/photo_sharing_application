const express=require('express');
const mysql2=require('mysql2');
const cors = require('cors')
const upload = require('./middleware.js')
const path = require('path'); 
const fs = require('fs');    

const userRoutes = require('./routes/userRoutes.js');
const postRoutes = require('./routes/postRoutes.js')

const app = express();
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('./uploads'));

app.use('/user',userRoutes);
app.use('/posts', postRoutes);

app.listen(3001,()=>{
    console.log("server on ")
})