import { create } from 'zustand';
import { JobPost, Section, SubSection, ContentBlock, BlockType, SectionChild } from '@/admin/types';

interface JobState {
  job: JobPost;
  // Metadata
  setJob: (job: JobPost) => void;
  updateMetadata: (updates: Partial<JobPost>) => void;

  // Sections
  addSection: () => void;
  updateSection: (sectionId: string, title: string) => void;
  deleteSection: (sectionId: string) => void;
  moveSection: (index: number, direction: 'up' | 'down') => void;
  reorderSections: (startIndex: number, endIndex: number) => void;

  // Children (Blocks & SubSections)
  addBlock: (sectionId: string, type: BlockType, subSectionId?: string) => void;
  addSubSection: (sectionId: string) => void;
  updateSubSection: (sectionId: string, subSectionId: string, title: string) => void;
  deleteChild: (sectionId: string, childId: string, subSectionId?: string) => void;
  updateBlock: (sectionId: string, blockId: string, updates: Partial<ContentBlock>, subSectionId?: string) => void;
  moveChild: (sectionId: string, index: number, direction: 'up' | 'down', subSectionId?: string) => void;
  reorderChildren: (sectionId: string, startIndex: number, endIndex: number, subSectionId?: string) => void;
}

const initialJob: JobPost = {
  id: '1',
  title: 'Government Clerk Vacancy 2024',
  slug: 'govt-clerk-vacancy-2024',
  shortDescription: 'Latest clerk recruitment notification.',
  updatedAt: new Date().toISOString(),
  sections: []
};

export const useJobStore = create<JobState>((set) => ({
  job: initialJob,

  setJob: (job) => set({ job }),

  updateMetadata: (updates) => set((state) => ({
    job: { ...state.job, ...updates, updatedAt: new Date().toISOString() }
  })),

  addSection: () => set((state) => {
    const nextNum = state.job.sections.length + 1;
    const newSection: Section = {
      id: crypto.randomUUID(),
      title: `Section ${nextNum}`,
      type: 'SECTION',
      children: []
    };
    return { job: { ...state.job, sections: [...state.job.sections, newSection] } };
  }),

  updateSection: (sectionId, title) => set((state) => ({
    job: {
      ...state.job,
      sections: state.job.sections.map(s => s.id === sectionId ? { ...s, title } : s)
    }
  })),

  deleteSection: (sectionId) => set((state) => ({
    job: {
      ...state.job,
      sections: state.job.sections.filter(s => s.id !== sectionId)
    }
  })),

  moveSection: (index, direction) => set((state) => {
    const sections = [...state.job.sections];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return state;
    [sections[index], sections[targetIdx]] = [sections[targetIdx], sections[index]];
    return { job: { ...state.job, sections } };
  }),

  reorderSections: (startIndex, endIndex) => set((state) => {
    const sections = [...state.job.sections];
    const [removed] = sections.splice(startIndex, 1);
    sections.splice(endIndex, 0, removed);
    return { job: { ...state.job, sections } };
  }),

  addSubSection: (sectionId) => set((state) => {
    const sections = state.job.sections.map(s => {
      if (s.id !== sectionId) return s;
      const subNum = s.children.filter(c => c.type === 'SUB_SECTION').length + 1;
      const newSub: SubSection = {
        id: crypto.randomUUID(),
        type: 'SUB_SECTION',
        title: `Sub-Section ${subNum}`,
        children: []
      };
      return { ...s, children: [...s.children, newSub] };
    });
    return { job: { ...state.job, sections } };
  }),

  updateSubSection: (sectionId, subSectionId, title) => set((state) => ({
    job: {
      ...state.job,
      sections: state.job.sections.map(s => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          children: s.children.map(c => (c.id === subSectionId && c.type === 'SUB_SECTION') ? { ...c, title } : c)
        };
      })
    }
  })),

  addBlock: (sectionId, type, subSectionId) => set((state) => {
    const newBlock: ContentBlock = {
      id: crypto.randomUUID(),
      type,
      ...(type === BlockType.TABLE
        ? { tableData: { columns: ['Item', 'Details'], rows: [{ 'Item': '', 'Details': '' }] } }
        : type === BlockType.MARKDOWN ? { value: '' } : { key: '', value: '' })
    };

    const sections = state.job.sections.map(s => {
      if (s.id !== sectionId) return s;
      if (subSectionId) {
        return {
          ...s,
          children: s.children.map(c => {
            if (c.id === subSectionId && c.type === 'SUB_SECTION') {
              return { ...c, children: [...c.children, newBlock] };
            }
            return c;
          })
        };
      }
      return { ...s, children: [...s.children, newBlock] };
    });
    return { job: { ...state.job, sections } };
  }),

  updateBlock: (sectionId, blockId, updates, subSectionId) => set((state) => ({
    job: {
      ...state.job,
      sections: state.job.sections.map(s => {
        if (s.id !== sectionId) return s;
        if (subSectionId) {
          return {
            ...s,
            children: s.children.map(c => {
              if (c.id === subSectionId && c.type === 'SUB_SECTION') {
                return { ...c, children: c.children.map(b => b.id === blockId ? { ...b, ...updates } : b) };
              }
              return c;
            })
          };
        }
        return {
          ...s,
          children: s.children.map(c => c.id === blockId ? { ...c, ...updates } : c)
        };
      })
    }
  })),

  deleteChild: (sectionId, childId, subSectionId) => set((state) => ({
    job: {
      ...state.job,
      sections: state.job.sections.map(s => {
        if (s.id !== sectionId) return s;
        if (subSectionId) {
          return {
            ...s,
            children: s.children.map(c => {
              if (c.id === subSectionId && c.type === 'SUB_SECTION') {
                return { ...c, children: c.children.filter(b => b.id !== childId) };
              }
              return c;
            })
          };
        }
        return { ...s, children: s.children.filter(c => c.id !== childId) };
      })
    }
  })),

  moveChild: (sectionId, index, direction, subSectionId) => set((state) => {
    const sections = state.job.sections.map(s => {
      if (s.id !== sectionId) return s;

      const move = (arr: any[], idx: number) => {
        const newArr = [...arr];
        const target = direction === 'up' ? idx - 1 : idx + 1;
        if (target < 0 || target >= newArr.length) return newArr;
        [newArr[idx], newArr[target]] = [newArr[target], newArr[idx]];
        return newArr;
      };

      if (subSectionId) {
        return {
          ...s,
          children: s.children.map(c => {
            if (c.id === subSectionId && c.type === 'SUB_SECTION') {
              return { ...c, children: move(c.children, index) };
            }
            return c;
          })
        };
      }
      return { ...s, children: move(s.children, index) };
    });
    return { job: { ...state.job, sections } };
  }),

  reorderChildren: (sectionId, startIndex, endIndex, subSectionId) => set((state) => {
    const sections = state.job.sections.map(s => {
      if (s.id !== sectionId) return s;

      const reorder = (arr: any[]) => {
        const newArr = [...arr];
        const [removed] = newArr.splice(startIndex, 1);
        newArr.splice(endIndex, 0, removed);
        return newArr;
      };

      if (subSectionId) {
        return {
          ...s,
          children: s.children.map(c => {
            if (c.id === subSectionId && c.type === 'SUB_SECTION') {
              return { ...c, children: reorder(c.children) };
            }
            return c;
          })
        };
      }
      return { ...s, children: reorder(s.children) };
    });
    return { job: { ...state.job, sections } };
  })
}));