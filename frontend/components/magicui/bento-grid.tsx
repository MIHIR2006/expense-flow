"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

export const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | ReactNode;
  description?: string | ReactNode;
  header?: ReactNode;
  icon?: ReactNode;
}) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      className={cn(
        "group/bento row-span-1 flex flex-col justify-between space-y-4 overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition duration-200 hover:shadow-xl hover:shadow-purple-500/20",
        className
      )}
    >
      {header}
      <div className="transition duration-200 group-hover/bento:translate-x-1">
        {icon}
        <div className="mb-2 mt-2 font-bold text-white">
          {title}
        </div>
        <div className="text-sm font-normal text-white/60">
          {description}
        </div>
      </div>
    </motion.div>
  );
};
