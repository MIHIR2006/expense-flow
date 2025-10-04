"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";

const stats = [
  { value: 10000, suffix: "+", label: "Active Users" },
  { value: 1000000, suffix: "+", label: "Expenses Processed" },
  { value: 50, suffix: "M+", label: "Managed Monthly", prefix: "$" },
  { value: 150, suffix: "+", label: "Countries" },
];

export default function StatsSection() {
  return (
    <section className="relative py-32">
      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent" />
      </div>
    </section>
  );
}

function StatCard({
  value,
  suffix,
  label,
  prefix = "",
}: {
  value: number;
  suffix: string;
  label: string;
  prefix?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    if (latest >= 1000000) {
      return Math.round(latest / 1000000);
    }
    if (latest >= 1000) {
      return Math.round(latest / 1000);
    }
    return Math.round(latest);
  });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, {
        duration: 2,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [count, value, isInView]);

  const displayValue = value >= 1000000 ? "M" : value >= 1000 ? "K" : "";

  return (
    <div
      ref={ref}
      className="glass-card group relative overflow-hidden rounded-2xl p-8 text-center transition-all hover:scale-105"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-cyan-600/10 opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative">
        <motion.div className="mb-2 text-5xl font-bold text-gradient md:text-6xl">
          {prefix}
          <motion.span>{rounded}</motion.span>
          {displayValue}
          {suffix}
        </motion.div>
        <div className="text-sm font-medium text-white/60">{label}</div>
      </div>
    </div>
  );
}
