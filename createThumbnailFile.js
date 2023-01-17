const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const sharp = require('sharp');

exports.handler = async (event) => {
    const { key: Key } = event.Records[0].s3.object;

    if (Key.includes('avatar-')) {
        const uncompressedImage = await S3.getObject({
            Bucket: process.env.BUCKET_NAME,
            Key,
        }).promise();

        const compressedImageBuffer = await sharp(uncompressedImage.Body)
            .resize({
                width: 200,
                height: 200,
                fit: 'cover'
            })
            .toBuffer();

        await S3.putObject({
            Bucket: process.env.BUCKET_NAME,
            Key,
            Body: compressedImageBuffer,
            ContentType: "image"
        }).promise();
        console.log(`Compressing ${key} complete!`)
    }
}
