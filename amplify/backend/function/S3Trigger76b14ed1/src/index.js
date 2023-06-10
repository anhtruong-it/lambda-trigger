// Import the sharp library
const sharp = require('sharp');
const aws = require('aws-sdk');
const s3 = new aws.S3();

exports.handler = async function (event, context) {
  // if the event type is delete, return from the function
  if (event.Records[0].eventName === 'ObjectRemoved:Delete') return

  // Next, we get the bucket name and the key from event
  const BUCKET = event.Records[0].s3.bucket.name;
  const KEY = event.Records[0].s3.object.key;
  console.log(`Bucket: ${BUCKET}`, `Key: ${KEY}`);
  try {
    // Fetch image data from s3
    let image = await s3.getObject({ Bucket: BUCKET, Key: KEY }).promise()
    image = await sharp(image.Body)

    // Get the metadata from the image, including the width and the height
    const metadata = await image.metadata()
    if (metadata.width > 1000) {
      // If the width is greater than 1000, the image is resized
      const resizedImage = await image.resize({ width: 1000 }).toBuffer()
      await s3.putObject({
        Bucket: BUCKET,
        Body: resizedImage,
        Key: KEY
      }).promise()
      return
    } else {
      return
    }
  } catch (err) {
    context.fail(`error getting file: ${err}`);
  }
};
