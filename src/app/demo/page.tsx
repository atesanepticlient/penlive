"use client";
import AnimatedSlider from "@/components/hightlights/slider-neumoriphic";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <AnimatedSlider initialValue={1200} onChange={()=> {}} />
    </div>
  );
}
