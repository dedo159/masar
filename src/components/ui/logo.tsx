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
  xs: "w-6 h-auto",
  sm: "w-8 h-auto",
  md: "w-12 h-auto",
  lg: "w-16 h-auto",
  xl: "w-24 h-auto",
};

const iconSizeMap = {
  xs: "w-6 h-6",
  sm: "w-8 h-8",
  md: "w-11 h-11",
  lg: "w-14 h-14",
  xl: "w-20 h-20",
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
          width={80}
          height={80}
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
          width={180}
          height={115}
          priority={priority}
          className={cn("object-contain", sizeMap[size])}
        />
      </div>
    );
  }

  if (variant === "color") {
    return (
      <div className={cn("relative inline-flex items-center justify-center select-none flex-shrink-0", className)}>
        <Image
          src="/masar-logo-color.png"
          alt="مسار — MASAR"
          width={180}
          height={115}
          priority={priority}
          className={cn("object-contain drop-shadow-sm", sizeMap[size])}
        />
      </div>
    );
  }

  return (
    <div className={cn("relative inline-flex items-center justify-center select-none flex-shrink-0", className)}>
      <Image
        src={isDark ? "/masar-logo-color.png" : "/masar-logo-black.png"}
        alt="مسار — MASAR"
        width={180}
        height={115}
        priority={priority}
        className={cn("object-contain", sizeMap[size])}
      />
    </div>
  );
}

