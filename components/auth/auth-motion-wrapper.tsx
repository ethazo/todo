"use client";
import { motion } from "framer-motion";

export function AuthMotionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // Advanced spring easing curve for smoothness
      }}
      className="w-full flex justify-center relative z-10"
    >
      {children}
    </motion.div>
  );
}