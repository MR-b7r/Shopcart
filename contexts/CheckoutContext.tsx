'use client';

import React, { createContext, useContext, ReactNode } from 'react';

export interface CheckoutStep {
  id: number;
  label: string;
  buttonLabel: string;
  onNext: () => void | Promise<void>;
}

interface CheckoutContextType {
  currentStep: number;
  steps: CheckoutStep[];
  canGoBack: boolean;
  canGoForward: boolean;
  goToStep: (step: number) => void;
  goNext: () => void | Promise<void>;
  goBack: () => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined
);

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within CheckoutProvider');
  }
  return context;
}

interface CheckoutProviderProps {
  children: ReactNode;
  currentStep: number;
  steps: CheckoutStep[];
  onStepChange: (step: number) => void;
}

export function CheckoutProvider({
  children,
  currentStep,
  steps,
  onStepChange,
}: CheckoutProviderProps) {
  const canGoBack = currentStep > 1;
  const canGoForward = currentStep < steps.length;

  const goToStep = (step: number) => {
    if (step >= 1 && step <= steps.length) {
      onStepChange(step);
    }
  };

  const goNext = () => {
    const currentStepConfig = steps[currentStep - 1];
    if (currentStepConfig?.onNext) {
      return currentStepConfig.onNext();
    }
    if (canGoForward) {
      goToStep(currentStep + 1);
    }
  };

  const goBack = () => {
    if (canGoBack) {
      goToStep(currentStep - 1);
    }
  };

  const value: CheckoutContextType = {
    currentStep,
    steps,
    canGoBack,
    canGoForward,
    goToStep,
    goNext,
    goBack,
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
}
