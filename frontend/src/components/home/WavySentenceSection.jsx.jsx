// src/components/WavySentenceSection.jsx
"use client";
import React from "react";
import { WavyBackground } from "@/components/ui/wavy-background.jsx";
import { cn } from "@/lib/utils";

const WavySentenceSection = ({
  sentence = "Empowering ideas with creativity and code.",
  className,
  ...props
}) => {
  return (
    <section
      className={cn(
        "relative h-[50vh] flex items-center justify-center overflow-hidden",
        className
      )}
      {...props}
    >
      <WavyBackground
        colors={[
            
            "#F97316",
            "#06B6D4",
            "#14B8A6",
            "#EF4444",
            "#3B82F6",
            
        ]}
        blur={12}
        speed="slow"
        waveOpacity={1}
        containerClassName="absolute inset-0"
        className="flex items-center justify-center"
      >
        <h2 className="font-display text-4xl md:text-6xl font-bold text-center px-6 leading-tight text-white drop-shadow-[0_5px_30px_rgba(0,0,0,0.3)]">
          {sentence}
        </h2>
      </WavyBackground>
    </section>
  );
};

export default WavySentenceSection;
