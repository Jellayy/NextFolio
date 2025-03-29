"use client";

import { useState } from "react";
import Image from "next/image";

export function ImageComponent({ src, alt, width, height }: { src: string, alt: string, width: number, height: number }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    }

    const closeModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = 'auto';
    }

    return (
        <>
            <div className="cursor-pointer" onClick={openModal}>
                <Image
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
                    className="transition-opacity duration-300 hover:opacity-90"
                />
            </div>

            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
                    onClick={closeModal}
                >
                    <div className="relative max-w-[95vw] max-h-[95vh]">
                        {/* Close button */}
                        <button
                            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 z-10"
                            onClick={closeModal}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                        <Image
                            src={src}
                            alt={alt}
                            width={width * 2} // Higher resolution for the modal
                            height={height * 2}
                            className="object-contain max-h-[95vh] max-w-[95vw]"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image
                            priority // Load with priority
                        />
                    </div>
                </div>
            )}
        </>
    )
}