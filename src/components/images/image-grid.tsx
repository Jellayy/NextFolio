import { ImageComponent } from "~/components/images/image";

import type { Photo } from "@prisma/client";

export function ImageGrid({ photos }: { photos: Photo[] }) {
    return (
        <div className="container mx-auto py-8">
            <h2 className="text-3xl font-bold mb-6">Photos</h2>

            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                {photos.map((photo) => (
                    <ImageComponent key={photo.id} src={photo.storageKey} alt={photo.description ? photo.description : ""} width={photo.width} height={photo.height}/>
                ))}
            </div>
        </div>
    )
}