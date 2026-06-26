import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getProduct } from "@/lib/actions/product.actions";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductFeatures from "@/components/product/ProductFeatures";
import ProductInteraction from "@/components/ProductInteraction";
import ReviewsSection from "@/components/reviews/ReviewsSection";
import Image from "next/image";

export const generateMetadata = async ({
  params,
}: {
  params: { id: string };
}) => {
  const { id } = params;
  const product = await getProduct(id);

  return {
    title: product.name,
    description: product.description,
  };
};

const page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ color: string; size: string }>;
}) => {
  const { size, color } = await searchParams;
  const { id } = await params;

  const product = await getProduct(id);
  const selectedSize = size || (product.sizes[0] as string);
  const selectedColor = color || (product.colors[0] as string);

  // Mock review data - TODO: Replace with actual data from server action
  const mockReviews = [
    {
      id: "1",
      productId: id,
      userId: "user1",
      userName: "Sarah Johnson",
      rating: 5,
      comment:
        "Absolutely love this product! The quality is exceptional and it arrived much faster than expected. Highly recommend to everyone!",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: "2",
      productId: id,
      userId: "user2",
      userName: "Michael Chen",
      rating: 4,
      comment:
        "Great quality and very comfortable. Only minor issue was a small defect on arrival, but customer service handled it perfectly.",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: "3",
      productId: id,
      userId: "user3",
      userName: "Emma Rodriguez",
      rating: 5,
      comment:
        "This is exactly what I was looking for! Perfect fit, great color, and the material is so soft. Will definitely order again.",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  ];

  const mockSummary = {
    averageRating: 4.7,
    totalReviews: mockReviews.length,
    ratingDistribution: {
      5: 2,
      4: 1,
      3: 0,
      2: 0,
      1: 0,
    },
  };

  return (
    <div className="w-full space-y-12 mt-8 md:mt-12">
      {/* Main Product Section */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Gallery - Left Column */}
        <div className="w-full lg:w-1/2">
          <ProductGallery
            images={product.images as Record<string, string>}
            selectedColor={selectedColor}
            productName={product.name}
          />
        </div>

        {/* Info & Interaction - Right Column */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <ProductInfo
            name={product.name}
            description={product.description}
            price={product.price}
            rating={mockSummary.averageRating}
            reviewCount={mockSummary.totalReviews}
          />

          <ProductInteraction
            product={product}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
          />

          {/* Payment Methods */}
          <div className="border-t pt-4">
            <p className="text-xs text-muted-foreground mb-3">
              Accepted payment methods:
            </p>
            <div className="flex items-center gap-2">
              <Image
                src="/klarna.png"
                alt="klarna"
                width={50}
                height={25}
                className="rounded-md"
              />
              <Image
                src="/cards.png"
                alt="cards"
                width={50}
                height={25}
                className="rounded-md"
              />
              <Image
                src="/stripe.png"
                alt="stripe"
                width={50}
                height={25}
                className="rounded-md"
              />
            </div>
            <p className="text-gray-500 text-xs mt-4">
              By clicking Pay Now, you agree to our{" "}
              <span className="underline hover:text-foreground cursor-pointer">
                Terms &amp; Conditions
              </span>{" "}
              and{" "}
              <span className="underline hover:text-foreground cursor-pointer">
                Privacy Policy
              </span>
              . You authorize us to charge your selected payment method for the
              total amount shown. All sales are subject to our return and{" "}
              <span className="underline hover:text-foreground cursor-pointer">
                Refund Policies
              </span>
              .
            </p>
          </div>

          {/* Features */}
          <ProductFeatures />
        </div>
      </div>

      {/* Product Information Accordion */}
      <div className="w-full">
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="product-info"
        >
          <AccordionItem value="product-info">
            <AccordionTrigger>Product Information</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>
                Designed with comfort and style in mind, this piece features
                premium-quality fabric that feels soft, breathable, and durable.
                The modern fit and detailed craftsmanship make it suitable for
                both casual and everyday wear.
              </p>
              <p>
                Each item undergoes strict quality checks to ensure perfect
                stitching, long-lasting colors, and a refined finish that
                elevates any outfit.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="shipping-details">
            <AccordionTrigger>Shipping Details</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>
                We offer reliable shipping worldwide through trusted delivery
                partners. Orders are processed within 24 hours, ensuring fast
                and efficient dispatch.
              </p>
              <p>
                Standard delivery typically arrives within 3–5 business days,
                while express shipping reaches you in 1–2 business days. Each
                package is securely packed, insured, and includes a tracking
                number for real-time updates.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="return-policy">
            <AccordionTrigger>Return Policy</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>
                Your satisfaction is our priority. We provide a 30-day return
                policy for all orders. If the item doesn&apos;t meet your
                expectations, you may return it in its original condition for a
                full refund or exchange.
              </p>
              <p>
                Returns are quick and hassle-free — simply initiate a request
                through your account, and we&apos;ll provide the return label.
                Refunds are processed within 48 hours of receiving the returned
                item.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Reviews Section */}
      <div className="w-full">
        <ReviewsSection
          productId={id}
          reviews={mockReviews}
          summary={mockSummary}
        />
      </div>
    </div>
  );
};

export default page;
