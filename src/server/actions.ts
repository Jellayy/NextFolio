"use server";

import { auth } from "~/server/auth";

import { db } from "~/server/db";
import { putFile } from "~/lib/s3";

import sharp from "sharp";
import { createId } from "@paralleldrive/cuid2";

export type CreateAlbumState = string | null;
export type UploadImagesState = string | null;

export async function createAlbum(previousState: CreateAlbumState, formData: FormData) {
    const session = await auth();
    if (!session || !session.user) {
        return "Unauthorized"
    }

    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const isPublic = formData.has('public');

    if (!name || !slug) {
        return "Name & Slug are required"
    }

    try {
        await db.album.create({
            data: {
                slug: slug,
                title: name,
                description: description,
                isPublic: isPublic,
                date: new Date(),
            }
        })
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('Unique constraint failed')) {
                return "An album with this slug already exists";
            }
            console.error("Album creation error: ", error);
            return `Error creating album: ${error.message}`
        }
        console.error("Unknown album creation error: ", error);
        return "An unexpected error occurred while creating the album, check server logs"
    }

    return "Creation Successful"
}

async function getImageMetadata(file: File) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const metadata = await sharp(buffer).metadata();

        return {
            width: metadata.width || 0,
            height: metadata.height || 0,
            size: buffer.length,
            mimeType: file.type,
        }
    } catch (error) {
        console.error("Error extracting image metadata: ", error);
        return {
            width: 0,
            height: 0,
            size: 0,
            mimeType: file.type
        }
    }
}

export async function uploadImages(previousState: UploadImagesState, formData: FormData) {
    const session = await auth()
    if (!session || !session.user) {
        return "Unauthorized"
    }

    const images = [];

    for (let i = 0; ; i++) {
        const file = formData.get(`image-${i}`)
        const description = formData.get(`description-${i}`)

        if (!file || !(file instanceof File)) {
            break;
        }

        images.push({
            file,
            description: description ? String(description) : ""
        })
    }

    if (images.length === 0) {
        return "No images found in upload";
    }

    try {
        const uploadPromises = images.map(async ({file, description}, index) => {
            const cuid = createId();

            const storageKey = await putFile(file, `photos/${cuid}`)

            const metadata = await getImageMetadata(file);

            const filename = "placeholder.jpeg";
            const width = metadata.width;
            const height = metadata.height;
            const size = metadata.size;
            const format = metadata.mimeType;
            const date = new Date();

            await db.photo.create({
                data: {
                    id: cuid,
                    fileName: filename,
                    storageKey: storageKey,
                    description: description,
                    width: width,
                    height: height,
                    size: size,
                    format: format,
                    date: date,
                }
            })

            return "https://picsum.photos/200";
        })

        await Promise.all(uploadPromises);

        return `Successfully uploaded ${images.length} image${images.length > 1 ? 's' : ''}`;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Image upload error: ", error);
            return `Error uploading images: ${error.message}`;
        }
        console.error("Unknown image upload error: ", error);
        return "An unexpected error ocurred while uploading images, check server logs";
    }
}