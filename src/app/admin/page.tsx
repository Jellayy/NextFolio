import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

import { CreateAlbumForm } from "~/components/admin/create-album";
import { UploadImages } from "~/components/admin/upload-images";
import { ImageGrid } from "~/components/images/image-grid";

export default async function Admin() {
    // TODO: This only checks if you're logged in
    // We still need to iron out how the whole instance admin thing works
    const session = await auth();
    if (!session || !session.user) {
        redirect("/api/auth/signin");
    }

    const photos = await db.photo.findMany()

    return (
        <>
            <CreateAlbumForm />
            <UploadImages />

            <ImageGrid photos={photos}/>
        </>
    )
}