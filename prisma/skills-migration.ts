/**
 * سكريبت هجرة المهارات من JSON حر (students.skills) إلى جداول مُطبَّعة
 * يُنشئ إدخالات في SkillTaxonomy ثم يربطها في StudentSkill
 * 
 * التشغيل: npx tsx prisma/skills-migration.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateSkills() {
  console.log('🔄 بدء هجرة المهارات...');

  // 1. قراءة جميع الطلاب ومهاراتهم (JSON string)
  const students = await prisma.student.findMany({
    select: { id: true, skills: true },
  });

  const allSkillNames = new Set<string>();

  // 2. جمع كل المهارات الفريدة
  for (const student of students) {
    try {
      const skills: string[] = JSON.parse(student.skills);
      for (const s of skills) {
        const trimmed = s.trim();
        if (trimmed.length > 0) {
          allSkillNames.add(trimmed);
        }
      }
    } catch {
      console.warn(`⚠️ تعذر تحليل مهارات الطالب ${student.id}`);
    }
  }

  console.log(`📋 تم العثور على ${allSkillNames.size} مهارة فريدة`);

  // 3. إنشاء سجلات SkillTaxonomy
  const skillMap = new Map<string, string>(); // name → id

  for (const name of allSkillNames) {
    // تصنيف تلقائي بسيط
    const nameLower = name.toLowerCase();
    let category = 'technical';
    
    const softSkills = ['العلاقات العامة', 'المهارات الحياتية', 'القيادة', 'العمل الجماعي',
      'التواصل', 'حل المشكلات', 'التفكير النقدي', 'إدارة الوقت', 'البحث العلمي',
      'leadership', 'teamwork', 'communication', 'problem solving'];
    
    const languageSkills = ['english', 'arabic', 'french', 'الإنجليزية', 'العربية', 'الفرنسية'];

    if (softSkills.some(s => nameLower.includes(s.toLowerCase()))) {
      category = 'soft';
    } else if (languageSkills.some(s => nameLower.includes(s.toLowerCase()))) {
      category = 'language';
    }

    const skill = await prisma.skillTaxonomy.upsert({
      where: { name },
      create: { name, category },
      update: {},
    });

    skillMap.set(name, skill.id);
  }

  console.log(`✅ تم إنشاء/تحديث ${skillMap.size} مهارة في SkillTaxonomy`);

  // 4. ربط كل طالب بمهاراته
  let linkedCount = 0;

  for (const student of students) {
    try {
      const skills: string[] = JSON.parse(student.skills);
      for (const s of skills) {
        const trimmed = s.trim();
        const skillId = skillMap.get(trimmed);
        if (!skillId) continue;

        await prisma.studentSkill.upsert({
          where: {
            studentId_skillId: {
              studentId: student.id,
              skillId,
            },
          },
          create: {
            studentId: student.id,
            skillId,
            level: 'intermediate', // Default for migrated skills
          },
          update: {},
        });

        linkedCount++;
      }
    } catch {
      console.warn(`⚠️ تعذر ربط مهارات الطالب ${student.id}`);
    }
  }

  console.log(`🔗 تم ربط ${linkedCount} مهارة-طالب في StudentSkill`);
  console.log('✅ اكتملت هجرة المهارات بنجاح!');
}

migrateSkills()
  .catch((e) => {
    console.error('❌ خطأ أثناء هجرة المهارات:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
