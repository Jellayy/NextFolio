"use server";

import { auth } from "~/server/auth";

import { db } from "~/server/db";

export type CreateAlbumState = string | null;

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