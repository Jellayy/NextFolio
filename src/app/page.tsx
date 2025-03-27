import { db } from "~/server/db"

export default async function Example() {
  const albums = await db.album.findMany();

  return (
    <div>
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-white">Recent Albums</h2>
          <a href="#" className="hidden text-sm font-medium text-indigo-300 hover:text-indigo-500 md:block">
            View All
            <span aria-hidden="true"> &rarr;</span>
          </a>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-x-8">
          {albums.map((album) => (
            <div key={album.id} className="group relative">
              <div className="w-full aspect-square overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75">
                <img src='https://picsum.photos/200' className="size-full object-cover" />
              </div>
              <h3 className="mt-4 text-sm text-white">
                <a href="#">
                  <span className="absolute inset-0" />
                  {album.title}
                </a>
              </h3>
              <p className="mt-1 text-sm text-gray-500">{album.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
