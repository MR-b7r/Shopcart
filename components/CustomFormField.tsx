import React from "react";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import "react-phone-number-input/style.css";

import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";

interface CustomFormProps {
  fieldType: "input";
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
}

const RenderInput = ({
  field,
  props,
}: {
  field: any;
  props: CustomFormProps;
}) => {
  const {
    fieldType,
    control,
    name,
    label,
    placeholder,
    iconSrc,
    iconAlt,
    showTimeSelect,
    dateFormat,
    renderSkeleton,
  } = props;

  switch (fieldType) {
    case "input":
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          {iconSrc && (
            <Image
              src={iconSrc}
              height={24}
              width={24}
              alt={iconAlt || "icon"}
              className="ml-2"
            />
          )}
          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              className="shad-input border-0"
            />
          </FormControl>
        </div>
      );
  }
};
const CustomFormField = (props: CustomFormProps) => {
  const { fieldType, control, name, label, placeholder, iconSrc, iconAlt } =
    props;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel className="shad-input-label">{label}</FormLabel>

          <RenderInput field={field} props={props} />
          <FormMessage className="text-red-400" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
