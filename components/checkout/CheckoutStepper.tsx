'use client';

import { Check } from 'lucide-react';

interface CheckoutStep {
  id: number;
  label: string;
  status: 'completed' | 'active' | 'upcoming';
}

interface CheckoutStepperProps {
  currentStep: number;
}

export function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  const steps: CheckoutStep[] = [
    { id: 1, label: 'Shopping Cart', status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'active' : 'upcoming' },
    { id: 2, label: 'Shipping Address', status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'active' : 'upcoming' },
    { id: 3, label: 'Payment Method', status: currentStep === 3 ? 'active' : 'upcoming' },
  ];

  return (
    <div className="w-full bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between relative">
          {/* Progress line background */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-border -translate-y-1/2" />
          <div className="absolute top-1/2 left-0 h-1 bg-primary transition-all duration-300 -translate-y-1/2" style={{ width: `${((currentStep - 1) / 2) * 100}%` }} />

          {/* Steps */}
          <div className="relative flex w-full justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`
                    relative z-10 flex items-center justify-center
                    w-10 h-10 rounded-full font-semibold transition-all duration-300
                    ${
                      step.status === 'completed'
                        ? 'bg-primary text-primary-foreground'
                        : step.status === 'active'
                          ? 'bg-primary text-primary-foreground ring-4 ring-primary/30'
                          : 'bg-secondary text-muted-foreground border border-border'
                    }
                  `}
                >
                  {step.status === 'completed' ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>
                <label className="mt-3 text-sm font-medium text-center max-w-[100px]">
                  {step.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
