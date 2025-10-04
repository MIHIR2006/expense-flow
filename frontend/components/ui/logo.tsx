import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
  variant?: "default" | "minimal";
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10", 
  lg: "h-12 w-12"
};

const textSizeClasses = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl"
};

export default function Logo({ 
  size = "md", 
  showText = true, 
  className = "",
  variant = "default"
}: LogoProps) {
  // Use higher resolution image for better quality
  const getImageSrc = () => {
    switch (size) {
      case "sm": return "/favicon-32x32.png";
      case "md": return "/android-chrome-192x192.png";
      case "lg": return "/android-chrome-512x512.png";
      default: return "/android-chrome-192x192.png";
    }
  };

  const getImageSize = () => {
    switch (size) {
      case "sm": return 32;
      case "md": return 192;
      case "lg": return 512;
      default: return 192;
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <Image
          src={getImageSrc()}
          alt="ExpenseFlow Logo"
          width={getImageSize()}
          height={getImageSize()}
          className={`${sizeClasses[size]} rounded-full object-cover shadow-lg`}
          style={{
            imageRendering: 'crisp-edges',
            WebkitImageRendering: 'crisp-edges',
            imageRendering: 'high-quality',
          }}
          quality={100}
          priority
        />
        {variant === "default" && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600/20 to-blue-600/20"></div>
        )}
      </div>
      {showText && (
        <span className={`${textSizeClasses[size]} font-bold text-white`}>
          ExpenseFlow
        </span>
      )}
    </div>
  );
}
