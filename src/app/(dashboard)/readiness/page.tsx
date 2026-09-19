"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ReadinessClient } from "./readiness-client";

export default function ReadinessPage() {
  const router = useRouter();
  const faculty = typeof window !== "undefined" ? localStorage.getItem("masar_user_faculty") : null;

  useEffect(() => {
    if (faculty && faculty !== "it") {
      router.replace("/");
    }
  }, [faculty, router]);

  if (faculty && faculty !== "it") {
    return null;
  }

  return <ReadinessClient />;
}