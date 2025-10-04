"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface GlobeProps {
  className?: string;
  markers?: Array<{ lat: number; lng: number; city: string }>;
  markerColor?: string;
}

export default function Globe({
  className,
  markers = [],
  markerColor = "#3b82f6",
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rotation = 0;
    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 20;

      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 1;

      for (let i = -90; i <= 90; i += 15) {
        const y = centerY + (radius * Math.sin((i * Math.PI) / 180));
        const r = radius * Math.cos((i * Math.PI) / 180);

        ctx.beginPath();
        ctx.ellipse(centerX, y, r, r * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (let i = 0; i < 360; i += 30) {
        ctx.beginPath();
        ctx.ellipse(
          centerX,
          centerY,
          radius,
          radius * 0.3,
          (i * Math.PI) / 180,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }

      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();

      if (markers && markers.length > 0) {
        markers.forEach((marker) => {
          const angle = ((marker.lng + rotation) * Math.PI) / 180;
          const latRad = (marker.lat * Math.PI) / 180;

          const x = centerX + radius * Math.cos(latRad) * Math.sin(angle);
          const y = centerY + radius * Math.sin(latRad);

          ctx.fillStyle = markerColor;
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.shadowColor = markerColor;
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }

      rotation += 0.2;
      requestAnimationFrame(animate);
    };

    animate();
  }, [markers, markerColor]);

  return (
    <div className={cn("relative", className)}>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="h-full w-full"
      />
    </div>
  );
}
