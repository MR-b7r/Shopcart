import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ShippingFormInputs, shippingFormSchema } from "@/types";

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
const ShippingForm = ({
  setShippingForm,
}: {
  setShippingForm: (data: ShippingFormInputs) => void;
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof shippingFormSchema>>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
    },
  });
  function onSubmit(data: z.infer<typeof shippingFormSchema>) {
    setShippingForm(data);
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
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-xs text-gray-500 font-medium">
                name
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
          name="email"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-xs text-gray-500 font-medium ">
                Email
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="haithambahr@gmail.com"
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
          name="phone"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-xs text-gray-500 font-medium">
                Phone
              </FormLabel>
              <FormControl>
                <Input placeholder="01512345678" {...field} />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-xs text-gray-500 font-medium">
                Address
              </FormLabel>
              <FormControl>
                <Input placeholder="123 Main St, Anytown" {...field} />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-xs text-gray-500 font-medium">
                City
              </FormLabel>
              <FormControl>
                <Input placeholder="Cairo" {...field} />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-gray-800 hover:bg-gray-900 transition-all duration-300 text-white p-2 rounded-lg cursor-pointer flex items-center justify-center gap-2"
        >
          Continue to Payment
        </Button>
      </form>
    </Form>
  );
};

export default ShippingForm;
