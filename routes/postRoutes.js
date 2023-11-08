const express = require('express');
const mysql2=require('mysql2');
const upload = require('../middleware.js')
const path = require('path'); 
const fs = require('fs');   

const router = express.Router();

const db = mysql2.createConnection({
  user:process.env.DB_USERNAME,
  host:process.env.DB_HOST,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
})

router.post('/create',upload.single('postimg'),(req,res) => {
    const title = req.body.posttitle;
    const about = req.body.postabout;
    const destination = req.body.postdestination;
    const category = req.body.postcategory;
    const imagePath = req.file.path;

    //console.log(req.file)

    db.query("INSERT INTO posts (posttitle,postabout,postdestination,postcategory,postimg) VALUES (?,?,?,?,?)",
    [title,about,destination,category,imagePath], 
    (err,result) => {
       if(err){
        console.log(err);
       } 
       else{
        res.send("yo")
       }
    });
})

router.get('/',(req,res)=>{
    db.query("SELECT * FROM posts", (err,result)=>{
      if(err){
        console.log(err)
      }  
      else{
        res.send(result)
      }
    })
})

router.delete('/delete/:id',(req,res)=>{
  const postid = req.params.id;
  //console.log(postid)

  db.query("SELECT postimg FROM posts WHERE postid = ?",postid,(err,result)=>{
    if(err){
      console.log(err)
      return res.status(500).send("Error fetching image file path");
    }
    if (result.length === 0) {
      console.log(result)
      // Handle the case where the post doesn't exist
      return res.status(404).send("Post not found");
    }
    //console.log(result);
    const imagePath = result[0].postimg;
    //console.log(imagePath);

     // Use path.join to create a complete file path
    const filePath = path.join(__dirname, '..', imagePath);
    //console.log("Corrected:",filePath);

     // Use fs.unlink to delete the file
     fs.unlink(filePath, (deleteErr) => {
      if (deleteErr) {
        console.error('Error deleting file:', deleteErr);
        return res.status(500).send("Error deleting image file");
      }
      // Now that the image file is deleted, proceed to delete the post from the database
      db.query("DELETE FROM posts WHERE postid = ?", postid, (dbErr, dbResult) => {
        if (dbErr) {
          console.log(dbErr);
          return res.status(500).send("Error deleting post from the database");
        }

        // Return a success message
        res.send("Post and associated image deleted successfully");
      });
    });  
  })
})

module.exports = router;
