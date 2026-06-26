"use client";

import {
  Truck,
  Shield,
  RotateCcw,
  Clock,
  Package,
} from "lucide-react";
import React from "react";

export default function ProductFeatures() {
  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On orders over $50",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Stripe & PayPal",
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description: "30-day return window",
    },
    {
      icon: Clock,
      title: "Fast Delivery",
      description: "2-5 business days",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <div
            key={index}
            className="flex flex-col items-center text-center gap-2 p-3 rounded-lg bg-card border border-border"
          >
            <Icon className="w-5 h-5 text-primary" />
            <p className="text-xs md:text-sm font-medium text-foreground">
              {feature.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {feature.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
