import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const universities = await prisma.university.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(
      universities.map((u) => ({
        id: u.code,
        name: u.name,
        nameEn: u.nameEn,
        logo: u.logo || undefined,
      }))
    );
  } catch (error) {
    console.error("GET /api/universities error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
