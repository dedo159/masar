// ===========================
// Masar Platform — Type Definitions
// ===========================

export type University = {
  id: string;
  name: string;
  nameEn: string;
  logo?: string;
};

export type Student = {
  id: string;
  name: string;
  studentId: string;
  email: string;
  universityId: string;
  major: string;
  year: number;
  gpa: number;
  totalCredits: number;
  completedCredits: number;
  avatar?: string;
  github?: string;
  portfolio?: string;
  skills: string[];
};

export type Course = {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  credits: number;
  instructor: string;
  room: string;
  schedule: CourseSchedule[];
  grade?: CourseGrade;
  assignments: Assignment[];
  files: CourseFile[];
  status: "enrolled" | "completed" | "failed";
  semester: string;
  color: string;
};

export type CourseSchedule = {
  day: "sun" | "mon" | "tue" | "wed" | "thu";
  startTime: string;
  endTime: string;
  type: "lecture" | "lab" | "tutorial";
};

export type CourseGrade = {
  midterm?: number;
  final?: number;
  assignments?: number;
  participation?: number;
  total?: number;
  letter?: string;
};

export type Assignment = {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  dueDate: string;
  dueTime: string;
  status: "pending" | "submitted" | "graded" | "late";
  grade?: number;
  maxGrade: number;
  type: "assignment" | "quiz" | "project" | "exam";
};

export type CourseFile = {
  id: string;
  name: string;
  type: "pdf" | "pptx" | "docx" | "zip" | "link";
  url: string;
  uploadedAt: string;
  week?: number;
};

export type DegreeRequirement = {
  id: string;
  category: "mandatory" | "university" | "elective" | "major";
  categoryLabel: string;
  totalCredits: number;
  completedCredits: number;
  courses: DegreeRequirementCourse[];
};

export type DegreeRequirementCourse = {
  id: string;
  code: string;
  nameAr: string;
  credits: number;
  status: "completed" | "enrolled" | "available" | "locked";
  grade?: string;
};

export type Internship = {
  id: string;
  company: string;
  title: string;
  location: string;
  type: "remote" | "onsite" | "hybrid";
  duration: string;
  deadline?: string;
  applyUrl: string;
  tags: string[];
  isNew?: boolean;
};

export type Notification = {
  id: string;
  type: "deadline" | "grade" | "announcement" | "reminder";
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  link?: string;
};

export type TodayClass = {
  courseId: string;
  courseCode: string;
  courseNameAr: string;
  courseNameEn?: string;
  instructor: string;
  room: string;
  startTime: string;
  endTime: string;
  type: "lecture" | "lab" | "tutorial";
  color: string;
  status: "upcoming" | "ongoing" | "done";
};
