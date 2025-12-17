import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  paymentFormSchema,
  ShippingFormInputs,
  shippingFormSchema,
} from "@/types";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
const PaymentForm = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof paymentFormSchema>>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      cardHolder: "",
      cardNumber: "",
      expirationDate: "",
      cvv: "",
    },
  });
  function onSubmit(data: z.infer<typeof paymentFormSchema>) {
    router.push("/cart?step=3", { scroll: false });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="cardHolder"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-xs text-gray-500 font-medium">
                Name on card
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Haitham Bahr"
                  {...field}
                  className="border-b border-gray-200 py-2 outline-none text-sm"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cardNumber"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-xs text-gray-500 font-medium ">
                Card Number
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="4444 3333 2222 1111"
                  {...field}
                  className="border-b border-gray-200 py-2 outline-none text-sm"
                />
              </FormControl>
              <FormMessage className="text-red-500 text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="expirationDate"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-xs text-gray-500 font-medium">
                Expiration Date
              </FormLabel>
              <FormControl>
                <Input placeholder="01/27" {...field} />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cvv"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-xs text-gray-500 font-medium">
                CVV
              </FormLabel>
              <FormControl>
                <Input placeholder="123" {...field} />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-2 mt-4">
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

        <Button
          type="submit"
          className="w-full bg-gray-800 hover:bg-gray-900 transition-all duration-300 text-white p-2 rounded-lg cursor-pointer flex items-center justify-center gap-2"
        >
          Checkout
          <ShoppingCart className="w-3 h-3" />
        </Button>
      </form>
    </Form>
  );
};

export default PaymentForm;
