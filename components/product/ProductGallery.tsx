"use client";

import Image from "next/image";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductGalleryProps {
  images: Record<string, string>;
  selectedColor: string;
  productName: string;
}

export default function ProductGallery({
  images,
  selectedColor,
  productName,
}: ProductGalleryProps) {
  const imageArray = Object.entries(images);
  const currentImageUrl = images[selectedColor];
  const currentIndex = imageArray.findIndex(
    ([, url]) => url === currentImageUrl
  );
  const [isZoomed, setIsZoomed] = useState(false);

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? imageArray.length - 1 : currentIndex - 1;
    const [color] = imageArray[newIndex];
    const params = new URLSearchParams(window.location.search);
    params.set("color", color);
    window.history.pushState({}, "", `?${params.toString()}`);
  };

  const goToNext = () => {
    const newIndex = currentIndex === imageArray.length - 1 ? 0 : currentIndex + 1;
    const [color] = imageArray[newIndex];
    const params = new URLSearchParams(window.location.search);
    params.set("color", color);
    window.history.pushState({}, "", `?${params.toString()}`);
  };

  const goToImage = (color: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set("color", color);
    window.history.pushState({}, "", `?${params.toString()}`);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Main Gallery */}
      <div className="relative w-full aspect-[2/3] bg-background rounded-lg overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageUrl}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full"
            onHoverStart={() => setIsZoomed(true)}
            onHoverEnd={() => setIsZoomed(false)}
          >
            <Image
              src={currentImageUrl}
              alt={productName}
              fill
              className={`object-contain transition-transform duration-500 ${
                isZoomed ? "scale-110" : "scale-100"
              }`}
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-foreground/10 backdrop-blur-sm text-xs text-foreground">
          {currentIndex + 1} / {imageArray.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {imageArray.map(([color, url], index) => (
          <motion.button
            key={color}
            onClick={() => goToImage(color)}
            className={`relative flex-shrink-0 w-16 h-20 rounded-md border-2 transition-colors overflow-hidden ${
              url === currentImageUrl
                ? "border-primary"
                : "border-border hover:border-foreground/30"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`View ${color} image`}
            aria-current={url === currentImageUrl}
          >
            <Image
              src={url}
              alt={`${productName} in ${color}`}
              fill
              className="object-contain"
              sizes="80px"
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
