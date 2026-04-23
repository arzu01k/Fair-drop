"use client";

import { ScreenTransition } from "./motion/ScreenTransition";
import { ConnectStep } from "./steps/ConnectStep";
import { ResultStep } from "./steps/ResultStep";
import { SaleStep } from "./steps/SaleStep";
import { VerifyStep } from "./steps/VerifyStep";
import { AnimatePresence } from "motion/react";
import { useFlowStore } from "~~/services/store/flowStore";

export const BlitzGuardFlow = () => {
  const step = useFlowStore(s => s.step);
  const direction = useFlowStore(s => s.direction);

  return (
    <div className="relative flex min-h-[calc(100vh-6rem)] w-full flex-col">
      <AnimatePresence mode="wait" custom={direction}>
        <ScreenTransition key={step} stepKey={step} direction={direction}>
          {step === "connect" && <ConnectStep />}
          {step === "verify" && <VerifyStep />}
          {step === "sale" && <SaleStep />}
          {step === "result" && <ResultStep />}
        </ScreenTransition>
      </AnimatePresence>
    </div>
  );
};
