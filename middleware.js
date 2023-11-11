const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

require('dotenv').config();

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: cyclic-gold-filthy-trout-us-west-1,
    acl: 'public-read', // Adjust according to your needs
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
  })
});

console.log('S3 Bucket Name:', process.env.S3_BUCKET_NAME);

module.exports = upload;




// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, './uploads');
//   },
//   filename: (req, file, callback) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const ext = path.extname(file.originalname);
//     callback(null, file.fieldname + '-' + uniqueSuffix + ext);
//   },
// });

// const upload = multer({ storage: storage });

// module.exports = upload;
