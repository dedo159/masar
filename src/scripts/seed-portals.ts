import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding portals data...");

  // 1. Ensure University exists
  let university = await prisma.university.findFirst({
    where: { code: "aau" },
  });

  if (!university) {
    university = await prisma.university.create({
      data: {
        code: "aau",
        name: "جامعة عمان الأهلية",
        nameEn: "Al Ahliyya Amman University",
      },
    });
  }

  // 2. University Staff
  const staffPassword = await bcrypt.hash("password123", 12);
  const staff = await prisma.universityStaff.upsert({
    where: { email: "staff@ammanu.edu.jo" },
    update: {
      passwordHash: staffPassword,
      name: "د. سامي الحموري",
      universityId: university.id,
      role: "admin",
    },
    create: {
      email: "staff@ammanu.edu.jo",
      passwordHash: staffPassword,
      name: "د. سامي الحموري",
      universityId: university.id,
      role: "admin",
    },
  });
  console.log("✅ University staff seeded:", staff.email);

  // 3. At-risk student for university demonstration
  const atRiskStudent = await prisma.student.upsert({
    where: { studentId: "202410199" },
    update: {},
    create: {
      id: "s-002",
      studentId: "202410199",
      name: "طارق زياد المجالي",
      email: "tariq@ammanu.edu.jo",
      major: "علم الحاسوب",
      year: 2,
      gpa: 2.15,
      totalCredits: 132,
      completedCredits: 45,
      universityId: university.id,
    },
  });

  // 4. Student Engagement Snapshots
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  await prisma.studentEngagementSnapshot.deleteMany({
    where: { studentId: { in: ["s-001", atRiskStudent.id] } },
  });

  // Snapshot for active student (ضياء)
  const mainStudent = await prisma.student.findFirst({ where: { id: "s-001" } });
  if (mainStudent) {
    await prisma.studentEngagementSnapshot.create({
      data: {
        studentId: mainStudent.id,
        lastLoginAt: new Date(),
        lateAssignments: 0,
        riskFlag: false,
      },
    });
  }

  // Snapshot for at-risk student (طارق)
  await prisma.studentEngagementSnapshot.create({
    data: {
      studentId: atRiskStudent.id,
      lastLoginAt: fourteenDaysAgo,
      lateAssignments: 3,
      riskFlag: true,
    },
  });
  console.log("✅ Student engagement snapshots seeded");

  // 5. Company & Recruiter
  const recruiterPassword = await bcrypt.hash("password123", 12);
  let company = await prisma.company.findFirst({
    where: { name: "زين الأردن" },
  });

  if (!company) {
    company = await prisma.company.create({
      data: {
        name: "زين الأردن",
        nameEn: "Zain Jordan",
        industry: "الاتصالات وتكنولوجيا المعلومات",
        website: "https://jo.zain.com",
        description: "شركة رائدة في مجال الاتصالات وخدمات البيانات الرقمية في الأردن",
        verified: true,
      },
    });
  }

  const recruiter = await prisma.companyRecruiter.upsert({
    where: { email: "recruiter@zain.jo" },
    update: {
      companyId: company.id,
      passwordHash: recruiterPassword,
      name: "عمر العبداللات",
      role: "admin",
    },
    create: {
      email: "recruiter@zain.jo",
      passwordHash: recruiterPassword,
      name: "عمر العبداللات",
      companyId: company.id,
      role: "admin",
    },
  });
  console.log("✅ Company recruiter seeded:", recruiter.email);

  // 6. Link or create internship for Zain
  let internship = await prisma.internship.findFirst({
    where: { companyId: company.id },
  });

  if (!internship) {
    internship = await prisma.internship.create({
      data: {
        companyId: company.id,
        company: company.name,
        title: "متدرب — تطوير الواجهات الأمامية (React / Next.js)",
        location: "عمان، الأردن",
        type: "hybrid",
        duration: "3 أشهر",
        deadline: "2025-06-30",
        applyUrl: "https://jo.zain.com/careers",
        tags: JSON.stringify(["Next.js", "React", "TypeScript", "Tailwind"]),
        isNew: true,
      },
    });
  }
  // 7. Seed Merchants and Deals
  const merchantPassword = await bcrypt.hash("password123", 12);

  // Merchant 1: Restaurants
  const merchant1 = await prisma.merchant.upsert({
    where: { contactEmail: "shawarma@aldiaa.jo" },
    update: {
      passwordHash: merchantPassword,
      businessName: "شاورما الضيعة",
      category: "مطاعم",
      verified: true,
    },
    create: {
      businessName: "شاورما الضيعة",
      category: "مطاعم",
      contactEmail: "shawarma@aldiaa.jo",
      passwordHash: merchantPassword,
      verified: true,
    },
  });

  // Merchant 2: Libraries
  const merchant2 = await prisma.merchant.upsert({
    where: { contactEmail: "alrowad@library.jo" },
    update: {
      passwordHash: merchantPassword,
      businessName: "مكتبة ومطبعة الرواد الجامعية",
      category: "مكتبات",
      verified: true,
    },
    create: {
      businessName: "مكتبة ومطبعة الرواد الجامعية",
      category: "مكتبات",
      contactEmail: "alrowad@library.jo",
      passwordHash: merchantPassword,
      verified: true,
    },
  });

  // Merchant 3: Transportation
  const merchant3 = await prisma.merchant.upsert({
    where: { contactEmail: "alaman@transport.jo" },
    update: {
      passwordHash: merchantPassword,
      businessName: "شركة الأمان للمواصلات والرحلات الجامعية",
      category: "مواصلات",
      verified: true,
    },
    create: {
      businessName: "شركة الأمان للمواصلات والرحلات الجامعية",
      category: "مواصلات",
      contactEmail: "alaman@transport.jo",
      passwordHash: merchantPassword,
      verified: true,
    },
  });

  console.log("✅ 3 Merchants seeded successfully");

  // Clean and recreate active deals for these merchants
  await prisma.merchantDeal.deleteMany({
    where: { merchantId: { in: [merchant1.id, merchant2.id, merchant3.id] } },
  });

  const now = new Date();
  const in20Days = new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000);
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const in45Days = new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000);
  const in60Days = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

  // Deals for Shawarma Al-Diaa
  await prisma.merchantDeal.createMany({
    data: [
      {
        merchantId: merchant1.id,
        title: "خصم 20% على جميع الوجبات العائلية والفردية",
        description: "استمتع بأشهى وجبات الشاورما الإيطالية والعربية مع خصم خاص وحصري لجميع طلاب الجامعات.",
        discountLabel: "خصم 20%",
        termsConditions: "يسري العرض يومياً من الساعة 12 ظهراً حتى 8 مساءً عند إبراز البطاقة الجامعية داخل الصالة، غير شامل التوصيل.",
        validFrom: now,
        validUntil: in30Days,
        isActive: true,
        redemptionCount: 14,
      },
      {
        merchantId: merchant1.id,
        title: "اشترِ وجبة سوبر شاورما واحصل على الثانية بنصف السعر",
        description: "عرض التوفير للطلاب والأصدقاء — وجبة سوبر شاورما دجاج أو لحم والثانية بنصف السعر فوراً.",
        discountLabel: "50% على الوجبة الثانية",
        termsConditions: "العرض متاح أيام الأحد والثلاثاء والخميس للطلبة، يسري على وجبات الحجم السوبر فقط.",
        validFrom: now,
        validUntil: in45Days,
        isActive: true,
        redemptionCount: 8,
      },
    ],
  });

  // Deals for Al-Rowad Library
  await prisma.merchantDeal.createMany({
    data: [
      {
        merchantId: merchant2.id,
        title: "خصم 30% على طباعة وتجليد مشاريع التخرج والأبحاث",
        description: "طباعة ليزرية عالية الدقة بالألوان وتجليد كرتوني ومخملي معتمد لدى كافة الكليات والجامعات.",
        discountLabel: "خصم 30%",
        termsConditions: "يسري الخصم على أبحاث ومشاريع التخرج التي تتجاوز 40 صفحة، يشمل التدقيق التنسيقي المبدئي مجاناً.",
        validFrom: now,
        validUntil: in60Days,
        isActive: true,
        redemptionCount: 29,
      },
      {
        merchantId: merchant2.id,
        title: "خصم 15% على الدفاتر والقرطاسية ومستلزمات الهندسة والعمارة",
        description: "جميع الأدوات الهندسية، أقلام التحبير، أوراق الرسم الهندسي، والملازم الدراسية بأسعار طلابية خاصة.",
        discountLabel: "خصم 15%",
        termsConditions: "العرض ساري طوال الفصل الدراسي لطلبة الهندسة والفنون والعلوم.",
        validFrom: now,
        validUntil: in20Days,
        isActive: true,
        redemptionCount: 42,
      },
    ],
  });

  // Deals for Al-Aman Transport
  await prisma.merchantDeal.createMany({
    data: [
      {
        merchantId: merchant3.id,
        title: "خصم 25% على اشتراكات الباصات والخطوط الجامعية الشهرية",
        description: "خدمة نقل يومية مريحة ومكيفة من مختلف محافظات المملكة إلى بوابات الكليات مباشرة مع إنترنت مجاني.",
        discountLabel: "خصم 25%",
        termsConditions: "مخصص للاشتراكات الفصلية والشهرية الجديدة للطلبة النظاميين.",
        validFrom: now,
        validUntil: in30Days,
        isActive: true,
        redemptionCount: 19,
      },
      {
        merchantId: merchant3.id,
        title: "رحلتك الأولى مجاناً داخل الحرم ومحيط البوابات الجامعية",
        description: "جرب خدمة التوصيل السريع بين مجمعات الكليات والشارع التجاري مجاناً للرحلة الأولى.",
        discountLabel: "رحلة أولى مجاناً",
        termsConditions: "صالحة لرحلة فردية واحدة بحد أقصى 3 دنانير عبر تطبيق الأمان مع إبراز كود مسار.",
        validFrom: now,
        validUntil: in45Days,
        isActive: true,
        redemptionCount: 31,
      },
    ],
  });

  console.log("✅ 6 Active Deals seeded successfully");

  console.log("🎉 All portal & merchant seeds completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
