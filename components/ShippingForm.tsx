"use client";

import React, { forwardRef, useImperativeHandle } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ShippingFormInputs, shippingFormSchema } from "@/lib/types";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export interface ShippingFormHandle {
  submit: () => Promise<boolean>;
  getData: () => ShippingFormInputs | null;
}

interface ShippingFormProps {
  onSubmitSuccess: (data: ShippingFormInputs) => void;
}

const ShippingForm = forwardRef<ShippingFormHandle, ShippingFormProps>(
  ({ onSubmitSuccess }, ref) => {
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

    const onSubmit = async (data: z.infer<typeof shippingFormSchema>) => {
      try {
        onSubmitSuccess(data);
        return true;
      } catch (error) {
        console.error("Form submission error:", error);
        return false;
      }
    };

    useImperativeHandle(ref, () => ({
      submit: async () => {
        const isValid = await form.trigger();
        if (isValid) {
          await form.handleSubmit(onSubmit)();
          return true;
        }
        return false;
      },
      getData: () => {
        const state = form.getValues();
        return form.formState.isValid ? state : null;
      },
    }));

    return (
      <div className="bg-card border border-border rounded-xl shadow-sm p-6 lg:sticky lg:top-6 flex flex-col gap-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-8"
          >
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                  Contact Information
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1.5">
                      <FormLabel className="text-[13px] font-medium text-foreground">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Haitham Bahr"
                          {...field}
                          className="w-full h-11 px-3 pr-9 text-sm bg-background border rounded-lg text-foreground placeholder:text-muted-foreground outline-none transition-all duration-150"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1.5">
                      <FormLabel className="text-[13px] font-medium text-foreground">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="haithambahr@gmail.com"
                          {...field}
                          className="w-full h-11 px-3 pr-9 text-sm bg-background border rounded-lg text-foreground placeholder:text-muted-foreground outline-none transition-all duration-150"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />
                {/* Phone Number */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1.5">
                      <FormLabel className="text-[13px] font-medium text-foreground">
                        Phone
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="01512345678"
                          {...field}
                          className="w-full h-11 px-3 pr-9 text-sm bg-background border rounded-lg text-foreground placeholder:text-muted-foreground outline-none transition-all duration-150"
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
                {/* Address */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1.5">
                      <FormLabel className="text-[13px] font-medium text-foreground">
                        Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123 Main St, Anytown"
                          {...field}
                          className="w-full h-11 px-3 pr-9 text-sm bg-background border rounded-lg text-foreground placeholder:text-muted-foreground outline-none transition-all duration-150"
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
                {/* City */}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1.5">
                      <FormLabel className="text-[13px] font-medium text-foreground">
                        City
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Cairo"
                          {...field}
                          className="w-full h-11 px-3 pr-9 text-sm bg-background border rounded-lg text-foreground placeholder:text-muted-foreground outline-none transition-all duration-150"
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
            </section>
          </form>
        </Form>
      </div>
    );
  },
);

ShippingForm.displayName = "ShippingForm";

export default ShippingForm;
