import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialResumeState, ResumeStateData, ResumeProject } from './types';

interface ResumeStore {
  data: ResumeStateData;
  activeField: string | null;
  setActiveField: (field: string | null) => void;
  
  // Update actions
  updateBasics: (basics: Partial<ResumeStateData['basics']>) => void;
  updateSummary: (summary: string) => void;
  updateSkills: (skills: ResumeStateData['skills']) => void;
  addOrUpdateProject: (project: Partial<ResumeProject> & { title: string, role: string, bullets: string[], techStack: string[] }) => void;
  deleteProject: (id: string) => void;
  updateBulletPoint: (projectId: string, bulletIndex: number, newText: string) => void;
  updateEducation: (education: ResumeStateData['education']) => void;
  updateCertifications: (certifications: ResumeStateData['certifications']) => void;
  updateDesign: (design: Partial<ResumeStateData['design']>) => void;
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      data: initialResumeState,
      activeField: null,
      
      setActiveField: (field) => set({ activeField: field }),

      updateBasics: (basics) => set((state) => ({
        data: { ...state.data, basics: { ...state.data.basics, ...basics } },
        activeField: 'basics'
      })),

      updateSummary: (summary) => set((state) => ({
        data: { ...state.data, summary },
        activeField: 'summary'
      })),

      updateSkills: (skills) => set((state) => ({
        data: { ...state.data, skills },
        activeField: 'skills'
      })),

      addOrUpdateProject: (project) => set((state) => {
        const existingIndex = project.id ? state.data.projects.findIndex(p => p.id === project.id) : -1;
        let newProjects = [...state.data.projects];
        
        if (existingIndex >= 0) {
          newProjects[existingIndex] = { ...newProjects[existingIndex], ...project };
        } else {
          newProjects.push({
            id: project.id || `proj-${Date.now()}`,
            title: project.title,
            role: project.role,
            techStack: project.techStack,
            bullets: project.bullets,
            link: project.link || '',
          });
        }
        return { data: { ...state.data, projects: newProjects }, activeField: `projects` };
      }),

      deleteProject: (id) => set((state) => ({
        data: { ...state.data, projects: state.data.projects.filter(p => p.id !== id) },
        activeField: 'projects'
      })),

      updateBulletPoint: (projectId, bulletIndex, newText) => set((state) => {
        const newProjects = state.data.projects.map(p => {
          if (p.id === projectId) {
            const newBullets = [...p.bullets];
            if (bulletIndex >= 0 && bulletIndex < newBullets.length) {
              newBullets[bulletIndex] = newText;
            }
            return { ...p, bullets: newBullets };
          }
          return p;
        });
        return { data: { ...state.data, projects: newProjects }, activeField: `projects` };
      }),

      updateEducation: (education) => set((state) => ({
        data: { ...state.data, education },
        activeField: 'education'
      })),

      updateCertifications: (certifications) => set((state) => ({
        data: { ...state.data, certifications },
        activeField: 'certifications'
      })),

      updateDesign: (design) => set((state) => ({
        data: { ...state.data, design: { ...state.data.design, ...design } },
        activeField: 'design'
      })),
    }),
    {
      name: 'resume-storage', // key in localStorage
      partialize: (state) => ({ data: state.data }), // save only resume data, not activeField
    }
  )
);
