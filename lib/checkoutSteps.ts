import { ShippingFormHandle } from "@/components/ShippingForm";

export interface CheckoutStepConfig {
  id: number;
  title: string;
  description: string;
  buttonLabel: string;
  onSubmit?: (
    formRef?: React.RefObject<ShippingFormHandle>,
  ) => Promise<boolean>;
}

export const checkoutSteps: CheckoutStepConfig[] = [
  {
    id: 1,
    title: "Shopping Cart",
    description: "Review your items",
    buttonLabel: "Continue to Shipping",
  },
  {
    id: 2,
    title: "Shipping Address",
    description: "Enter delivery details",
    buttonLabel: "Continue to Payment",
    onSubmit: async (formRef) => {
      if (!formRef?.current) return false;
      return await formRef.current.submit();
    },
  },
  {
    id: 3,
    title: "Payment Method",
    description: "Complete your purchase",
    buttonLabel: "Complete Order",
  },
];
