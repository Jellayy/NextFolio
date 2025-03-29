"use client";

import { useState, useRef } from "react";
import { useActionState, useTransition } from "react";
import { uploadImages } from "~/server/actions";
import { Button } from "~/components/catalyst/button";
import { Text } from "~/components/catalyst/text";
import { Fieldset } from "~/components/catalyst/fieldset";
import { Legend } from "~/components/catalyst/fieldset";
import { Textarea } from "~/components/catalyst/textarea";
import { Label } from "~/components/catalyst/fieldset";

interface ImagePreview {
  file: File;
  preview: string;
  description: string;
}

export function UploadImages() {
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [message, formAction] = useActionState(uploadImages, null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const newImages: ImagePreview[] = [];
    
    Array.from(e.target.files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      
      const reader = new FileReader();
      reader.onload = () => {
        newImages.push({
          file,
          preview: reader.result as string,
          description: ""
        });
        
        if (newImages.length === e.target.files!.length) {
          setImages((prevImages) => [...prevImages, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
    
    const newImages: ImagePreview[] = [];
    
    Array.from(e.dataTransfer.files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      
      const reader = new FileReader();
      reader.onload = () => {
        newImages.push({
          file,
          preview: reader.result as string,
          description: ""
        });
        
        if (newImages.length === e.dataTransfer.files.length) {
          setImages((prevImages) => [...prevImages, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const updateDescription = (index: number, description: string) => {
    setImages(images.map((img, i) => 
      i === index ? { ...img, description } : img
    ));
  };

  const handleSubmit = (formData: FormData) => {
    // Early return if no images
    if (images.length === 0) {
      return;
    }
    
    // Add all images and descriptions to the form data
    images.forEach((img, index) => {
      formData.append(`image-${index}`, img.file);
      formData.append(`description-${index}`, img.description);
    });
    
    // The startTransition is now handled by the form action
    return formData;
  };

  return (
    <Fieldset>
      <Legend>Upload Images</Legend>
      
      <form action={async (formData) => {
        startTransition(() => {
          const data = handleSubmit(formData);
          if (data) {
            formAction(data);
          }
        });
      }} className="space-y-4">
        <div 
          className="border-1 border-white/10 rounded-lg p-8 text-center cursor-pointer hover:border-white/20 transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-10 w-10 mx-auto text-gray-400"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
            />
          </svg>
          <Text className="mt-2">Drag and drop images here, or click to select files</Text>
        </div>
        
        {images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {images.map((img, index) => (
              <div key={index} className="border border-white/10 hover:border-white/20 rounded-lg p-3 shadow-sm">
                <div className="relative group">
                  <img 
                    src={img.preview} 
                    alt={`Preview ${index}`}
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M6 18L18 6M6 6l12 12" 
                      />
                    </svg>
                  </button>
                </div>
                <Text className="text-sm mt-2 truncate font-medium">{img.file.name}</Text>
                <div className="mt-2">
                  <Label htmlFor={`description-${index}`} className="text-sm">Description</Label>
                  <Textarea 
                    id={`description-${index}`}
                    value={img.description}
                    onChange={(e) => updateDescription(index, e.target.value)}
                    placeholder="Add a description for this image"
                    className="mt-1 text-sm resize-none"
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        
        {images.length > 0 && (
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending} className="mt-4">
              {isPending ? (
                <div className="flex items-center">
                  <span>Uploading...</span>
                </div>
              ) : (
                "Upload Images"
              )}
            </Button>
          </div>
        )}
        
        {message && (
          <div className={`p-2 mt-4 rounded-md ${message.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            <Text>{message}</Text>
          </div>
        )}
      </form>
    </Fieldset>
  );
}