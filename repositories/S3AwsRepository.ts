import AWS, { S3 } from 'aws-sdk';

/** Steps to use this:
 * Refer to this doc from AWS on how to create S3 supporting Identity to use in this component. https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-photo-album.html
 *  (1) Create Cognito identity pool (see this) and grab the ID of the pool
 *  (2) Ensure the IAM created by cognito has access to your S3 bucket
 *  (3) Use this vue component as a uploader component to upload one image. We can rewrite it to support multi images easily.
 *
 *  Once done through with the Prerequisite tasks part of the above, just grab the cognito Identity pool id and come here.
 *  Use it like this:
 *
 */
export const S3Key = {
  region: process.env.region,
  bucketName: process.env.bucketName,
  identityPoolId: process.env.bucketName,
  defaultFolder: 'my-first-bucket-path/',
};

export interface IPayload {
  contentType: string; // you can set it based on the type of image you are uploading like image/png
  fileName: string;
  file: string;
}

/*
new S3Service().uploadImage(payload, contentType).then((response) => {
  that.loading = false;
  that.yourCallbackAfterUploadIfNeeded(response);
});
*/

/**
 * Documentation for reference to this:
 * 1. AWS S3 JavaScript SDK ref: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property
 * 2. Cognito for identity pool to use here
 * 3. Nice blog on how to do the UI portion: https://www.academind.com/learn/vue-js/snippets/image-upload/
 * 4. Nice blog on how to handle image file base64:
 */

class S3Service {
  s3: S3;
  constructor() {
    AWS.config.update({
      region: 'ap-southeast-1',
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'ap-southeast-1:1539452e-c7bf-4855-ad74-d7d6a6785918',
      }),
    });

    //* / get reference to S3 client
    this.s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      params: { Bucket: 'bluemarble-hep1' },
    });
  }

  uploadImage(payload: IPayload) {
    const s3 = this.s3;
    return new Promise(function (resolve, reject) {
      const defaultFolder = 'my-first-bucket-path/';
      const encodedImage = payload.file;
      const decodedImage = Buffer.from(encodedImage, 'base64');

      const filePath = defaultFolder + payload.fileName;
      const params = {
        Body: decodedImage,
        Key: filePath,
        ACL:
          'public-read' /* This makes the image public, but only works if your S3 bucket allows public access */,
      };
      // @ts-ignore
      s3.upload(params, function (err, data) {
        if (err) {
          reject(err);
        } else {
          /**
           * data returned after upload will look like this:
           *          Bucket: "bucketName"
           Key: "somefilenametouseinS3.png"
           Location: "URL to your image"
           */
          resolve(data);
        }
      });
    });
  }

  urlOutput(fileName: string) {
    return (
      'https://' +
      S3Key.bucketName +
      '.s3-' +
      S3Key.region +
      '.amazonaws.com/' +
      fileName
    );
  }
}

export default S3Service;
