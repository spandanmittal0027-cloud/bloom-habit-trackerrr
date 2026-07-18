"use client";

import { motion, AnimatePresence } from "framer-motion";

export function HabitCardShell({
  emoji,
  name,
  color,
  complete,
  children,
}: {
  emoji: string;
  name: string;
  color: string;
  complete: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      layout
      className="paper-card relative overflow-hidden px-4 py-4"
      style={{
        backgroundColor: complete
          ? `color-mix(in srgb, ${color} 55%, var(--warm-white))`
          : undefined,
      }}
      animate={complete ? { scale: [1, 1.02, 1] } : { scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xl">{emoji}</span>
        <h3 className="text-sm font-medium leading-tight text-ink">{name}</h3>
      </div>

      {children}

      <AnimatePresence>
        {complete && (
          <motion.div
            key="bloom"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute -right-2 -top-2 text-2xl"
          >
            <motion.span
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 14 }}
            >
              🌸
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
