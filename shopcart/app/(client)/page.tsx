import ProductList from "@/components/ProductList";
import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
const Homepage = async ({
  searchParams,
}: {
  searchParams: Promise<{ category: string }>;
}) => {
  const category = (await searchParams).category;

  return (
    <div className="">
      {/* <Carousel className="w-full mx-auto h-full mb-12">
        <CarouselContent>
          <CarouselItem>
            <div className="relative aspect-[3/1] mb-12">
              <Image src="/featured.png" alt="Featured Product" fill />
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className="relative mb-12 w-full h-[400px]">
              <Image
                src="/featured-2.png"
                alt="Featured Product"
                fill
                className="object-contain"
              />
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className="relative mb-12 w-full h-full">
              <Image
                src="/featured-3.png"
                alt="Featured Product"
                fill
                className="object-contain"
              />
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel> */}
      <div className="relative aspect-[3/1] mb-12">
        <Image src="/featured.png" alt="Featured Product" fill />
      </div>
      <ProductList category={category} params="homepage" />
    </div>
  );
};

export default Homepage;
