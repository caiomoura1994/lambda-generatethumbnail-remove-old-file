const AWS = require('aws-sdk');
const S3 = new AWS.S3();

exports.handler = async (_event) => {
    const allFiles = await (
        S3
            .listObjectsV2({
                Bucket: process.env.TEMP_BUCKET_NAME
            })
            .promise()
    )
    const now = new Date()
    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
    await Promise.all(
        allFiles.Contents.map(object => {
            const objectGetTime = addDays(object.LastModified.getTime(), 3)
            if (now.getTime() >= objectGetTime.getTime()) {
                await S3.deleteObject({
                    Bucket: process.env.TEMP_BUCKET_NAME,
                    Key: object.Key,
                }).promise()
            }
        })
    )
    console.log(`Complete Deletation ${key} complete!`)
}