import React from "react"
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function LoadingAnimation() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center h-full w-full">
      <div role='status' aria-live='polite'>
        <DotLottieReact 
          src="/Loading Travel Animation.lottie"
          loop
          autoplay
        />
      </div>
    </div>
  )
}