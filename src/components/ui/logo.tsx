import Image from "next/image";
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

  return (
    <div className={cn("relative inline-flex items-center justify-center select-none", className)}>
      <Image
        src="/logo-black.png"
        alt="مسار"
        width={156}
        height={100}
        priority={priority}
        className={cn("block dark:hidden object-contain transition-opacity duration-200", sizeClass)}
      />
      <Image
        src="/logo-white.png"
        alt="مسار"
        width={156}
        height={100}
        priority={priority}
        className={cn("hidden dark:block object-contain transition-opacity duration-200", sizeClass)}
      />
    </div>
  );
}
