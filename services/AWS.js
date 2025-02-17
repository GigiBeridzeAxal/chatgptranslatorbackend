
const AWS = require('aws-sdk')



AWS.config.update({
    accessKeyId: process.env.awsid,
    secretAccessKey: process.env.awskey,
    region: process.env.bucketlocat, // e.g., 'us-west-2'
})

const s3 = new AWS.S3()


module.exports = s3