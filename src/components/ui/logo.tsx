"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface MasarLogoProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "full" | "icon" | "color" | "white";
  priority?: boolean;
}

const sizeMap = {
  xs: "w-20 sm:w-24 h-auto",
  sm: "w-28 sm:w-36 h-auto",
  md: "w-36 sm:w-48 h-auto",
  lg: "w-48 sm:w-60 h-auto",
  xl: "w-64 sm:w-80 h-auto",
};

const iconSizeMap = {
  xs: "w-7 h-7",
  sm: "w-10 h-10",
  md: "w-14 h-14",
  lg: "w-18 h-18",
  xl: "w-24 h-24",
};

export function MasarLogo({
  className,
  size = "sm",
  variant = "color",
  priority = false,
}: MasarLogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  if (variant === "icon") {
    return (
      <div className={cn("relative inline-flex items-center justify-center select-none flex-shrink-0", className)}>
        <Image
          src="/masar-icon.png"
          alt="مسار — MASAR"
          width={198}
          height={179}
          priority={priority}
          className={cn("object-contain drop-shadow-md", iconSizeMap[size])}
        />
      </div>
    );
  }

  if (variant === "white") {
    return (
      <div className={cn("relative inline-flex items-center justify-center select-none flex-shrink-0", className)}>
        <Image
          src="/masar-logo-white.png"
          alt="مسار — MASAR"
          width={248}
          height={98}
          priority={priority}
          className={cn("object-contain drop-shadow-sm", sizeMap[size])}
        />
      </div>
    );
  }

  // Dual-mode high contrast full logo (dark text in light mode, glowing text in dark mode)
  const logoSrc = isDark ? "/masar-logo-color.png" : "/masar-logo-light.png";

  return (
    <div className={cn("relative inline-flex items-center justify-center select-none flex-shrink-0", className)}>
      <Image
        src={logoSrc}
        alt="مسار — MASAR"
        width={455}
        height={179}
        priority={priority}
        className={cn("object-contain drop-shadow-sm transition-opacity duration-200", sizeMap[size])}
      />
    </div>
  );
}

