import multiparty from 'multiparty';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
const bucketName = process.env.S3_BUCKET_NAME;
import fs from 'fs';
import mime from 'mime-types';
import { isAdminRequest } from './auth/[...nextauth]';
import { mongooseConnect } from '@/lib/mongoose';

export default async function handle(req, res) {
    await mongooseConnect();
    await isAdminRequest(req, res);
    const form = new multiparty.Form();

    const client = new S3Client({
        region: 'us-east-1',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
        }
    });

    const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);

            resolve({ fields, files });
        });
    });

    const links = [];
    
    for (const file of files.file) {
        const ext = file.originalFilename.split('.').pop();
        const newFilename = `${Date.now()}.${ext}`;

        await client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: newFilename,
            Body: fs.readFileSync(file.path),
            ACL: 'public-read',
            ContentType: mime.lookup(file.path),
        }));

        const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`;
        links.push(link);
    }
    
    res.json({ links });
}

export const config = {
    api: { bodyParser: false }
};