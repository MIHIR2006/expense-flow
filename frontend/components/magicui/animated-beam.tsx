"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { RefObject, useEffect, useRef, useState } from "react";

interface AnimatedBeamProps {
  className?: string;
  containerClassName?: string;
  fromRef: RefObject<HTMLElement>;
  toRef: RefObject<HTMLElement>;
  curvature?: number;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
}

export default function AnimatedBeam({
  className,
  containerClassName,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = 2,
  delay = 0,
  gradientStartColor = "#9333ea",
  gradientStopColor = "#3b82f6",
}: AnimatedBeamProps) {
  const [pathD, setPathD] = useState("");
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const updatePath = () => {
      if (fromRef.current && toRef.current) {
        const fromRect = fromRef.current.getBoundingClientRect();
        const toRect = toRef.current.getBoundingClientRect();

        const fromX = fromRect.left + fromRect.width / 2;
        const fromY = fromRect.top + fromRect.height / 2;
        const toX = toRect.left + toRect.width / 2;
        const toY = toRect.top + toRect.height / 2;

        const minX = Math.min(fromX, toX);
        const minY = Math.min(fromY, toY);
        const maxX = Math.max(fromX, toX);
        const maxY = Math.max(fromY, toY);

        setSvgDimensions({
          width: maxX - minX,
          height: maxY - minY,
        });

        const startX = fromX - minX;
        const startY = fromY - minY;
        const endX = toX - minX;
        const endY = toY - minY;

        const controlPointX = startX + (endX - startX) / 2;
        const controlPointY = startY + curvature;

        const path = `M ${startX},${startY} Q ${controlPointX},${controlPointY} ${endX},${endY}`;
        setPathD(path);
      }
    };

    updatePath();
    window.addEventListener("resize", updatePath);
    return () => window.removeEventListener("resize", updatePath);
  }, [fromRef, toRef, curvature]);

  return (
    <div className={cn("pointer-events-none absolute inset-0", containerClassName)}>
      <svg
        width={svgDimensions.width}
        height={svgDimensions.height}
        className={cn("absolute", className)}
        style={{
          left: 0,
          top: 0,
        }}
      >
        <defs>
          <linearGradient
            id={`gradient-${Math.random()}`}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={gradientStartColor} />
            <stop offset="100%" stopColor={gradientStopColor} />
          </linearGradient>
        </defs>
        <motion.path
          ref={pathRef}
          d={pathD}
          stroke={`url(#gradient-${Math.random()})`}
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration,
            delay,
            repeat: Infinity,
            repeatType: reverse ? "reverse" : "loop",
            ease: "linear",
          }}
        />
      </svg>
    </div>
  );
}
