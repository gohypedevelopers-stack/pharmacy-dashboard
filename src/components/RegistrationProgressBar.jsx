// src/components/RegistrationProgressBar.jsx
// Shared horizontal stepper used on all 4 registration pages.
// Blue line moves in "half-segment" steps between icons.

import React, { useEffect, useState } from "react";

const steps = [
  { id: 1, label: "Personal Details", icon: "👤" },
  { id: 2, label: "Qualifications", icon: "🎓" },
  { id: 3, label: "Registration", icon: "📋" },
  { id: 4, label: "Identity", icon: "🪪" },
];

export default function RegistrationProgressBar({ currentStep }) {
  const totalSteps = steps.length;

  // One segment = distance between two icons along the line
  const segment = totalSteps > 1 ? 1 / (totalSteps - 1) : 1;

  // We want:
  // step 1 => 0.5 * segment
  // step 2 => 1.5 * segment
  // step 3 => 2.5 * segment
  // step 4 => 3.5 * segment (clamped to 1 / 100%)
  const targetProgress =
    totalSteps > 1 ? (currentStep - 0.5) * segment : 0;

  const clampedTarget = Math.min(Math.max(targetProgress, 0), 1);

  // Animated progress value (so line always starts from left and grows)
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    // restart from 0 so animation always starts at the beginning
    setAnimatedProgress(0);
    const timeoutId = setTimeout(() => {
      setAnimatedProgress(clampedTarget);
    }, 50); // small delay so CSS transition kicks in

    return () => clearTimeout(timeoutId);
  }, [clampedTarget]);

  const progressPercent = `${animatedProgress * 100}%`;

  return (
    <div className="w-full">
      <div className="relative">
        {/* Grey base line */}
        <div className="absolute left-0 right-0 top-[26px] h-[5px] rounded-full bg-[#e1e7f0]" />

        {/* Blue progress line (moves in half-segments) */}
        <div
          className="absolute left-0 top-[26px] h-[5px] rounded-full bg-[#2349c5] transition-all duration-500 ease-out"
          style={{ width: progressPercent }}
        />

        {/* Circles + labels, spaced evenly */}
        <div className="relative flex items-center justify-between">
          {steps.map((step) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;

            const baseCircle =
              "flex h-11 w-11 items-center justify-center rounded-full text-base border-[3px]";
            const circleClass = isActive
              ? `${baseCircle} border-[#2349c5] bg-[#2349c5] text-white shadow-[0_0_0_4px_rgba(35,73,197,0.16)]`
              : isCompleted
              ? `${baseCircle} border-[#2349c5] bg-[#e8efff] text-[#2349c5]`
              : `${baseCircle} border-[#e1e7f0] bg-[#f3f6fb] text-[#a5afc0]`;

            const labelClass =
              isActive || isCompleted
                ? "mt-3 text-sm font-semibold text-[#2349c5] text-center"
                : "mt-3 text-sm font-medium text-[#6c7587] text-center";

            return (
              <div key={step.id} className="flex flex-col items-center">
                <div className={circleClass}>{step.icon}</div>
                <span className={labelClass}>{step.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
