const express = require('express');
const mysql2=require('mysql2');
const router = express.Router();

const db = mysql2.createConnection({
    user:process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    password:process.env.DB_PASS,
    database: process.env.DB_NAME
  })

router.post('/signup', (req, res) => {
    const { name, email, password } = req.body;

    // Check if the user already exists in the database
    db.query('SELECT * FROM users WHERE useremail = ?', [email], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal server error');
        }

        if (rows.length > 0) {
            return res.status(409).send('User already exists');
        }

        // If the user doesn't exist, insert them into the database
        db.query('INSERT INTO users (username, useremail, userpassword) VALUES (?, ?, ?)',
            [name, email, password],
            (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Internal server error');
                }

                res.status(201).send('User created');
            }
        );
    });
});


router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists and credentials are valid
  db.query('SELECT * FROM users WHERE useremail = ? AND userpassword = ?',
      [email, password],
      (err, rows) => {
          if (err) {
              console.error(err);
              return res.status(500).send('Internal server error');
          }

          console.log(rows.length);

          if (rows.length === 0) {
            console.log("Invalid email or pass")
              return res.status(401).send('Invalid email or password');
          }

          const user = rows[0]; // Assuming there's only one user with the provided email/password

          //res.send(`Welcome ${user.username}`)
          
          res.send({
            userid: user.userid,
            username: user.username,
          });
      }
  );
});

module.exports = router;