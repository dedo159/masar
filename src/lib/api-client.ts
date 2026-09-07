import type {
  Student,
  Course,
  DegreeRequirement,
  Internship,
  Notification,
  TodayClass,
} from "@/lib/types";

// Base fetch helper with error handling
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    cache: "no-store", // Ensure fresh data from DB
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  getStudent: () => fetchApi<Student>("/api/students/me"),
  getCourses: () => fetchApi<Course[]>("/api/courses"),
  getCourse: (id: string) => fetchApi<Course>(`/api/courses/${id}`),
  getDegreeProgress: () => fetchApi<DegreeRequirement[]>("/api/degree-progress"),
  getInternships: () => fetchApi<Internship[]>("/api/internships"),
  getNotifications: () => fetchApi<Notification[]>("/api/notifications"),
  getTodaySchedule: () => fetchApi<TodayClass[]>("/api/today-schedule"),
  markNotificationRead: (id: string) =>
    fetchApi<{ success: boolean }>("/api/notifications", {
      method: "PATCH",
      body: JSON.stringify({ id }),
    }),
  markAllNotificationsRead: () =>
    fetchApi<{ success: boolean }>("/api/notifications", {
      method: "PATCH",
      body: JSON.stringify({ readAll: true }),
    }),
};
