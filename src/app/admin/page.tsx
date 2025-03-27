import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

import { CreateAlbumForm } from "~/components/admin";

export default async function Admin() {
    // TODO: This only checks if you're logged in
    // We still need to iron out how the whole instance admin thing works
    const session = await auth();
    if (!session || !session.user) {
        redirect("/api/auth/signin");
    }

    return (
        <CreateAlbumForm />
    )
}