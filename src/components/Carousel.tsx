// "use client";
// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { motion } from "framer-motion";
// import Image from "next/image";

// import slider_1 from "@/../public/slider/slider-platform-1.png";
// import slider_2 from "@/../public/slider/sliderplatfrom-2.png";

// const slides = [
//   { id: 1, img: slider_1 },
//   { id: 2, img: slider_2 },
// ];

// // How wide the active slide should be, as a fraction of the container.
// // The rest (1 - ACTIVE_FRACTION) is split between left and right peek.
// // Tune this to taste: 0.78 means the active image takes 78% of the width.
// const ACTIVE_FRACTION = 0.78;
// const PEEK_FRACTION = (1 - ACTIVE_FRACTION) / 2; // ~11% each side

// const AttractionCarousel = () => {
//   const [index, setIndex] = useState(0);
//   const [, setDirection] = useState(0);
//   const [containerWidth, setContainerWidth] = useState(0);
//   const containerRef = useRef<HTMLDivElement>(null);

//   // Measure the container so we can compute exact pixel offsets
//   useEffect(() => {
//     const el = containerRef.current;
//     if (!el) return;
//     const ro = new ResizeObserver(([entry]) => {
//       setContainerWidth(entry.contentRect.width);
//     });
//     ro.observe(el);
//     return () => ro.disconnect();
//   }, []);

//   const next = useCallback(() => {
//     setDirection(1);
//     setIndex((prev) => (prev + 1) % slides.length);
//   }, []);

//   const prev = useCallback(() => {
//     setDirection(-1);
//     setIndex((prev) => (prev - 1 + slides.length) % slides.length);
//   }, []);

//   useEffect(() => {
//     const timer = setInterval(next, 6000);
//     return () => clearInterval(timer);
//   }, [next]);

//   // Width of the center (active) image in px
//   const activeW = containerWidth * ACTIVE_FRACTION;
//   // Height is always 16:9 of the active width
//   const activeH = activeW / (16 / 9);
//   // Peek width
//   const peekW = containerWidth * PEEK_FRACTION;

//   // We lay out a virtual track: [...slides] repeated.
//   // The track offset positions the current slide in the center,
//   // with prev peeking from the left and next from the right.
//   //
//   // Track item width = activeW (center) + peekW (each side gets half its peek from this slide)
//   // Simpler: each slide occupies activeW on the track, and we offset so:
//   //   left edge of active slide = peekW  (leaving peekW for the prev slide to show)
//   //
//   // trackX = -(index * activeW) + peekW
//   const trackX = -index * activeW + peekW;

//   return (
//     <div className="relative w-full py-5">
//       <div
//         ref={containerRef}
//         className="relative w-full max-w-[1200px] mx-auto overflow-hidden"
//         style={{ height: activeH || undefined }}
//       >
//         {containerWidth > 0 && (
//           <motion.div
//             className="absolute top-0 flex"
//             style={{ height: activeH }}
//             animate={{ x: trackX }}
//             transition={{ type: "spring", stiffness: 300, damping: 35 }}
//             drag="x"
//             dragConstraints={{ left: 0, right: 0 }}
//             onDragEnd={(_, { offset }) => {
//               if (offset.x < -50) next();
//               else if (offset.x > 50) prev();
//             }}
//           >
//             {slides.map((slide, i) => {
//               const isActive = i === index;
//               return (
//                 <div
//                   key={slide.id}
//                   className="relative flex-shrink-0 cursor-grab active:cursor-grabbing"
//                   style={{ width: activeW, height: activeH }}
//                 >
//                   <motion.div
//                     className="absolute inset-0"
//                     animate={{
//                       scale: isActive ? 1 : 0.94,
//                       opacity: isActive ? 1 : 0.45,
//                     }}
//                     transition={{ duration: 0.4 }}
//                   >
//                     <Image
//                       src={slide.img}
//                       alt={`Slide ${i + 1}`}
//                       fill
//                       priority={isActive}
//                       // contain so 16:9 is never distorted
//                       className="object-contain"
//                     />
//                   </motion.div>
//                 </div>
//               );
//             })}
//           </motion.div>
//         )}
//       </div>

//       {/* Dot indicators */}
//       <div className="flex justify-center gap-3 mt-3">
//         {slides.map((_, i) => (
//           <motion.div
//             key={i}
//             onClick={() => setIndex(i)}
//             animate={{
//               width: i === index ? 40 : 12,
//               backgroundColor:
//                 i === index ? "#F9E498" : "rgba(255,255,255,0.2)",
//             }}
//             className="h-[4px] rounded-full cursor-pointer"
//             style={{ boxShadow: i === index ? "0 0 10px #D4AF37" : "none" }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AttractionCarousel;
"use client";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Keyboard } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Image from "next/image";

import "swiper/css";
import "swiper/css/pagination";

import slider_1 from "@/../public/slider/slider-platform-1.png";
import slider_2 from "@/../public/slider/sliderplatfrom-2.png";

const slides = [
  { id: 1, img: slider_1 },
  { id: 2, img: slider_2 },
];

// Fraction of the container width the active slide occupies; the remainder
// is split evenly between the left/right "peek" slides. slidesPerView is
// derived from this so Swiper reproduces the same peek layout.
const ACTIVE_FRACTION = 0.78;
const AUTOPLAY_MS = 6000;

type ImgMeta = { width: number; height: number };

const AttractionCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Size the box to the CURRENTLY ACTIVE slide's real aspect ratio (from the
  // static import metadata) so object-contain never has to crop or letterbox.
  const activeW = containerWidth * ACTIVE_FRACTION;
  const currentImg = slides[activeIndex].img as ImgMeta;
  const aspect =
    currentImg.width && currentImg.height
      ? currentImg.width / currentImg.height
      : 16 / 9;
  const activeH = activeW / aspect;

  return (
    <div className="attraction-carousel relative w-full py-5">
      <div
        ref={containerRef}
        className="relative w-full max-w-[1200px] mx-auto rounded-2xl   !h-[220px]"
        style={{ height: activeH || undefined }}
      >
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        {containerWidth > 0 && (
          <Swiper
            modules={[Autoplay, Pagination, Keyboard]}
            className="relative z-10 h-full w-full"
            centeredSlides
            loop
            slidesPerView={1 / ACTIVE_FRACTION}
            spaceBetween={0}
            speed={550}
            grabCursor
            keyboard={{ enabled: true }}
            autoplay={{
              delay: AUTOPLAY_MS,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{ el: ".attraction-carousel-pagination", clickable: true }}
            onSlideChange={(swiper: SwiperType) => setActiveIndex(swiper.realIndex)}
          >
            {slides.map((slide, i) => (
              <SwiperSlide
                key={slide.id}
                className="!flex items-center justify-center"
              >
                {({ isActive }) => {
                  const slideImg = slide.img as ImgMeta;
                  const slideAspect =
                    slideImg.width && slideImg.height
                      ? slideImg.width / slideImg.height
                      : 16 / 9;
                  return (
                    <div
                      className="relative rounded-xl overflow-hidden transition-all duration-450 ease-out"
                      style={{
                        width: activeW,
                        height: Math.min(activeW / slideAspect, activeH),
                        transform: isActive ? "scale(1)" : "scale(0.92)",
                        opacity: isActive ? 1 : 0.35,
                        boxShadow: isActive
                          ? "0 0 0 2px rgba(212,175,55,0.9), 0 8px 30px rgba(212,175,55,0.25)"
                          : "none",
                      }}
                    >
                      <Image
                        src={slide.img}
                        alt={`Slide ${i}`}
                        fill
                        priority={isActive}
                        draggable={false}
                        sizes="(max-width: 1200px) 90vw, 1200px"
                        className="object-contain pointer-events-none"
                      />
                    </div>
                  );
                }}
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* Dot indicators - Swiper renders bullets into this container */}
      <div className="attraction-carousel-pagination flex justify-center gap-3 mt-4" />

      <style jsx global>{`
        .attraction-carousel .swiper-pagination-bullet {
          width: 12px;
          height: 4px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.2);
          opacity: 1;
          margin: 0 !important;
          transition: all 0.3s ease;
          display: inline-block;
        }
        .attraction-carousel .swiper-pagination-bullet-active {
          width: 40px;
          background: #f9e498;
          box-shadow: 0 0 10px #d4af37;
        }
      `}</style>
    </div>
  );
};

export default AttractionCarousel;