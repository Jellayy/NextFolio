import { 
    S3Client,
    PutObjectCommand,
 } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.S3_REGION,
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: true, // TODO: Make this updateable for non-minio users
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string
    }
});


export async function putFile(file: File, key: string) {
    const body = (await file.arrayBuffer()) as Buffer;

    const mimeToExtension: Record<string, string> = {
        'image/jpeg': '.jpeg',
        'image/jpg': '.jpg',
        'image/png': '.png',
        'image/gif': '.gif',
        'image/webp': '.webp',
        'image/svg+xml': '.svg',
        'image/bmp': '.bmp',
        'image/tiff': '.tiff',
        'image/avif': '.avif',
        'image/heic': '.heic',
        'image/heif': '.heif'
    };
    const fileExtension = mimeToExtension[file.type] || '.jpeg'

    const response = await s3Client.send(new PutObjectCommand({
        Bucket: "pleasework",
        Key: `${key}${fileExtension}`,
        Body: body
    }))

    console.log(response);
    return `http://127.0.0.1:9000/pleasework/${key}${fileExtension}`
}