import { z } from 'zod';

// ---------------------------------------------------------
// 1. Core Resume Data Types
// ---------------------------------------------------------

export interface ResumeBasics {
  fullName: string;
  targetJobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface ResumeSkillCategory {
  category: string; // e.g., "Languages", "Frameworks", "Tools"
  items: string[];
}

export interface ResumeProject {
  id: string;
  title: string;
  role: string;
  techStack: string[];
  link: string;
  bullets: string[];
}

export interface ResumeEducation {
  id: string;
  institution: string;
  degree: string;
  graduationYear: string;
  relevantCoursework: string[];
}

export interface ResumeCertification {
  id: string;
  name: string;
  issuer: string;
  link: string;
}

export interface ResumeDesign {
  themeColor: string; // e.g., "blue", "green", "slate", "neutral"
  fontFamily: string; // e.g., "sans", "serif", "mono"
}

export interface ResumeStateData {
  design: ResumeDesign;
  basics: ResumeBasics;
  summary: string;
  skills: ResumeSkillCategory[];
  projects: ResumeProject[];
  education: ResumeEducation[];
  certifications: ResumeCertification[];
}

export const initialResumeState: ResumeStateData = {
  design: { themeColor: 'blue', fontFamily: 'sans' },
  basics: {
    fullName: "Student Name",
    targetJobTitle: "Software Engineer",
    email: "email@example.com",
    phone: "+962 70 000 0000",
    location: "Amman, Jordan",
    linkedin: "linkedin.com/in/username",
    github: "github.com/username",
    portfolio: "portfolio.com"
  },
  summary: "A passionate Software Engineering student with a strong foundation in modern web technologies and a drive to build scalable solutions. Experienced in developing full-stack applications and eager to contribute to innovative teams.",
  skills: [
    { category: "Languages", items: ["JavaScript", "TypeScript", "Python", "Java"] },
    { category: "Frameworks", items: ["React", "Next.js", "Node.js", "Express"] },
    { category: "Tools", items: ["Git", "Docker", "PostgreSQL", "MongoDB"] }
  ],
  projects: [
    {
      id: "proj-1",
      title: "E-Commerce Platform",
      role: "Full-Stack Developer",
      techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
      link: "github.com/username/ecommerce",
      bullets: [
        "Architected a scalable e-commerce platform handling 500+ daily active users using Next.js and Prisma.",
        "Improved page load speeds by 40% through implementing server-side rendering and static site generation.",
        "Integrated secure payment gateways reducing transaction failures by 15%."
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of Jordan",
      degree: "B.Sc. in Software Engineering",
      graduationYear: "2025",
      relevantCoursework: ["Data Structures", "Algorithms", "Database Systems", "Software Architecture"]
    }
  ],
  certifications: []
};

// ---------------------------------------------------------
// 2. AI Tool / Function Calling Zod Schemas
// ---------------------------------------------------------

export const updateBasicsSchema = z.object({
  fullName: z.string().optional(),
  targetJobTitle: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  portfolio: z.string().optional(),
});

export const updateSummarySchema = z.object({
  summary: z.string().describe("A professional, results-oriented professional summary (max 3 lines). No fluff."),
});

export const updateSkillsSchema = z.object({
  skills: z.array(z.object({
    category: z.string().describe("E.g., Languages, Frameworks, Databases, Tools"),
    items: z.array(z.string()).describe("List of technical skills in this category")
  }))
});

export const addOrUpdateProjectSchema = z.object({
  id: z.string().optional().describe("Provide existing project ID to update, or omit to create a new one."),
  title: z.string(),
  role: z.string(),
  techStack: z.array(z.string()),
  link: z.string().optional(),
  bullets: z.array(z.string()).describe("Impact-focused bullet points using Google's X-Y-Z formula.")
});

export const deleteProjectSchema = z.object({
  id: z.string()
});

export const updateBulletPointSchema = z.object({
  projectId: z.string(),
  bulletIndex: z.number(),
  newText: z.string().describe("The revised bullet point text.")
});

export const updateEducationSchema = z.object({
  education: z.array(z.object({
    id: z.string(),
    institution: z.string(),
    degree: z.string(),
    graduationYear: z.string(),
    relevantCoursework: z.array(z.string())
  }))
});

export const updateCertificationsSchema = z.object({
  certifications: z.array(z.object({
    id: z.string(),
    name: z.string(),
    issuer: z.string(),
    link: z.string()
  }))
});

export const updateDesignSchema = z.object({ themeColor: z.enum(['blue', 'green', 'slate', 'red', 'black']).describe('Primary accent color'), fontFamily: z.enum(['sans', 'serif', 'mono']).describe('Typography style') });
