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
  console.log("✅ Internship linked to company:", internship.title);

  console.log("🎉 All portal seeds completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
