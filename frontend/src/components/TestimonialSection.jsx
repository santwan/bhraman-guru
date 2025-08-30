import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TestimonialCard from "@/components/TestimonialCard";
import testimonials from "@/data/testimonial.json";

export default function TestimonialSection() {
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="reviews" className="relative w-full px-10 md:px-20 py-20 text-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-6xl mx-auto space-y-6"
      >
        {/* Badge */}
        <div className="flex justify-center">
          <span className="px-3 py-1 rounded-full text-sm bg-gray-800 text-gray-200">
          What Explorers Say
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-4xl text-black sm:text-5xl font-bold dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-b dark:from-blue-700 dark:via-sky-400 dark:to-indigo-700 dark:drop-shadow-[0_0_15px_rgba(255,72,72,0.3)]">
        Hear From Real Travelers
        </h2>

        {/* Subtext */}
        <p className="text-cyan-600 dark:text-gray-400 max-w-xl mx-auto">
        Discover how BhramanGuru made journeys smarter, smoother, and more memorable for fellow adventurers.
        </p>

        {/* Desktop Grid */}
        <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
          {testimonials.map((data, i) => (
            <TestimonialCard key={i} {...data} />
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="sm:hidden relative w-full max-w-sm mx-auto pt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="shadow-xl rounded-xl"
            >
              <TestimonialCard {...testimonials[index]} />
            </motion.div>
          </AnimatePresence>

          {/* Prev Button */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-orange-700/80 hover:bg-orange-600 p-2 rounded-full text-white shadow-lg transition"
          >
            <ChevronLeft />
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-orange-700/80 hover:bg-orange-600 p-2 rounded-full text-white shadow-lg transition"
          >
            <ChevronRight />
          </button>
        </div>


      </motion.div>
    </section>
  );
}
