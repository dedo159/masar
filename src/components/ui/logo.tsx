"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface MasarLogoProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  priority?: boolean;
}

const sizeMap = {
  xs: "w-5 h-auto",
  sm: "w-7 h-auto",
  md: "w-10 h-auto",
  lg: "w-14 h-auto",
  xl: "w-20 h-auto",
};

export function MasarLogo({ className, size = "sm", priority = false }: MasarLogoProps) {
  const sizeClass = sizeMap[size];
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : false;

  return (
    <div className={cn("relative inline-flex items-center justify-center select-none flex-shrink-0", className)}>
      <Image
        src={isDark ? "/logo-white.png" : "/logo-black.png"}
        alt="مسار"
        width={156}
        height={100}
        priority={priority}
        className={cn("object-contain", sizeClass)}
      />
    </div>
  );
}
