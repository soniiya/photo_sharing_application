import upload from './middleware';

const S3 = require('aws-sdk');
const fs = require('fs')
require('dotenv').config();

const accessKeyId= process.env.AWS_ACCESS_KEY_ID
const secretAccessKey= process.env.AWS_SECRET_ACCESS_KEY
const bucketName = process.env.AWS_BUCKET_NAME

const s3 = new S3({
    accessKeyId, secretAccessKey, bucketName
})

//uploads a file to s3 
export function upload(file){
    const fileStream = fs.createReadStream(file.path)
    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.fileName
    }
    return s3.upload(uploadParams).promise();
}
exports.uploadFile = uploadFile


//download a file from s3

