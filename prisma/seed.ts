import { PrismaClient } from "@prisma/client";
import { universities } from "../src/lib/mock-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 تهيئة قاعدة البيانات (Universities Setup)...");

  // إضافة وتحديث الجامعات فقط بدون بيانات وهمية
  for (const u of universities) {
    await prisma.university.upsert({
      where: { code: u.id },
      update: {
        name: u.name,
        nameEn: u.nameEn,
      },
      create: {
        code: u.id,
        name: u.name,
        nameEn: u.nameEn,
      },
    });
  }

  console.log("✅ تم تجهيز الجامعات الرسمية بنجاح دون أي بيانات وهمية!");
}

main()
  .catch((e) => {
    console.error("❌ خطأ أثناء التهيئة:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

