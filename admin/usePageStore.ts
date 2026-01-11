import { FieldType, IField, IFieldWithoutSubSection, IPage, ISection, ISubSectionField, PageType, SectionType } from '@/lib/page.types';
import { create } from 'zustand';

export enum ViewMode {
  EDIT = 'edit',
  PREVIEW = 'preview'
}

interface PageState {
  //view mode
  viewMode: ViewMode;
  setViewMode: (viewMode: ViewMode) => void;

  //page
  page: IPage;
  // Metadata
  setPage: (page: IPage) => void;
  updateMetadata: (updates: Partial<IPage>) => void;

  // Sections
  addSection: () => void;
  updateSection: (sectionId: string, title: string) => void;
  deleteSection: (sectionId: string) => void;
  moveSection: (index: number, direction: 'up' | 'down') => void;
  reorderSections: (startIndex: number, endIndex: number) => void;

  // Children (Blocks & SubSections)
  addBlock: (sectionId: string, type: FieldType, subSectionId?: string) => void;
  addSubSection: (sectionId: string) => void;
  updateSubSection: (sectionId: string, subSectionId: string, title: string) => void;
  deleteChild: (sectionId: string, childId: string, subSectionId?: string) => void;
  updateBlock: (sectionId: string, blockId: string, updates: Partial<IFieldWithoutSubSection>, subSectionId?: string) => void;
  moveChild: (sectionId: string, index: number, direction: 'up' | 'down', subSectionId?: string) => void;
  reorderChildren: (sectionId: string, startIndex: number, endIndex: number, subSectionId?: string) => void;

  // reset page
  resetPage: () => void;
}

function getInitialPage(): IPage {
  return {
    _id: crypto.randomUUID(),
    title: '',
    slug: '',
    description: '',
    updatedAt: new Date().toISOString(),
    type: PageType.JOB,
    sections: []
  }
}

export const usePageStore = create<PageState>((set) => ({
  viewMode: ViewMode.EDIT,
  setViewMode: (viewMode) => set({ viewMode }),

  page: getInitialPage(),

  setPage: (page) => set({ page }),

  updateMetadata: (updates) => set((state) => ({
    page: { ...state.page, ...updates, updatedAt: new Date().toISOString() }
  })),

  addSection: () => set((state) => {
    const nextNum = state.page.sections.length + 1;
    const newSection: ISection = {
      _id: crypto.randomUUID(),
      title: `Section ${nextNum}`,
      type: SectionType.SECTION,
      children: []
    };
    return { page: { ...state.page, sections: [...state.page.sections, newSection] } };
  }),

  updateSection: (sectionId, title) => set((state) => ({
    page: {
      ...state.page,
      sections: state.page.sections.map(s => s._id === sectionId ? { ...s, title } : s)
    }
  })),

  deleteSection: (sectionId) => set((state) => ({
    page: {
      ...state.page,
      sections: state.page.sections.filter(s => s._id !== sectionId)
    }
  })),

  moveSection: (index, direction) => set((state) => {
    const sections = [...state.page.sections];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return state;
    [sections[index], sections[targetIdx]] = [sections[targetIdx], sections[index]];
    return { page: { ...state.page, sections } };
  }),

  reorderSections: (startIndex, endIndex) => set((state) => {
    const sections = [...state.page.sections];
    const [removed] = sections.splice(startIndex, 1);
    sections.splice(endIndex, 0, removed);
    return { page: { ...state.page, sections } };
  }),

  addSubSection: (sectionId) => set((state) => {
    const sections = state.page.sections.map(s => {
      if (s._id !== sectionId) return s;
      const subNum = s.children.filter(c => c.type === FieldType.SUB_SECTION).length + 1;
      const newSub: ISubSectionField = {
        _id: crypto.randomUUID(),
        type: FieldType.SUB_SECTION,
        title: `Sub-Section ${subNum}`,
        children: []
      };
      return { ...s, children: [...s.children, newSub] };
    });
    return { page: { ...state.page, sections } };
  }),

  updateSubSection: (sectionId, subSectionId, title) => set((state) => ({
    page: {
      ...state.page,
      sections: state.page.sections.map(s => {
        if (s._id !== sectionId) return s;
        return {
          ...s,
          children: s.children.map(c => (c._id === subSectionId && c.type === FieldType.SUB_SECTION) ? { ...c, title } : c)
        };
      })
    }
  })),

  addBlock: (sectionId, type, subSectionId) => set((state) => {
    let newBlock: IFieldWithoutSubSection;
    const baseField = { _id: crypto.randomUUID() };

    switch (type) {
      case FieldType.TABLE:
        newBlock = {
          ...baseField,
          type: FieldType.TABLE,
          tableData: { columns: ['Item', 'Details'], rows: [{ 'Item': '', 'Details': '' }] }
        };
        break;
      case FieldType.MARKDOWN:
        newBlock = {
          ...baseField,
          type: FieldType.MARKDOWN,
          value: ''
        };
        break;
      case FieldType.KEY_VALUE:
      case FieldType.LINK:
      case FieldType.DATE:
        newBlock = {
          ...baseField,
          type,
          key: '',
          value: ''
        };
        break;
      default:
        // Handle SUB_SECTION or unexpected types safely or throw
        throw new Error(`Unsupported field type for addBlock: ${type}`);
    }

    const sections = state.page.sections.map(s => {
      if (s._id !== sectionId) return s;
      if (subSectionId) {
        return {
          ...s,
          children: s.children.map(c => {
            if (c._id === subSectionId && c.type === FieldType.SUB_SECTION) {
              return { ...c, children: [...c.children, newBlock] };
            }
            return c;
          })
        };
      }
      return { ...s, children: [...s.children, newBlock] };
    });
    return { page: { ...state.page, sections } };
  }),

  updateBlock: (sectionId, blockId, updates, subSectionId) => set((state) => ({
    page: {
      ...state.page,
      sections: state.page.sections.map(s => {
        if (s._id !== sectionId) return s;
        if (subSectionId) {
          return {
            ...s,
            children: s.children.map(c => {
              if (c._id === subSectionId && c.type === FieldType.SUB_SECTION) {
                return { ...c, children: c.children.map(b => b._id === blockId ? { ...b, ...updates } as IFieldWithoutSubSection : b) };
              }
              return c;
            })
          };
        }
        return {
          ...s,
          children: s.children.map(c => c._id === blockId ? { ...c, ...updates } as IField : c)
        };
      })
    }
  })),

  deleteChild: (sectionId, childId, subSectionId) => set((state) => ({
    page: {
      ...state.page,
      sections: state.page.sections.map(s => {
        if (s._id !== sectionId) return s;
        if (subSectionId) {
          return {
            ...s,
            children: s.children.map(c => {
              if (c._id === subSectionId && c.type === FieldType.SUB_SECTION) {
                return { ...c, children: c.children.filter(b => b._id !== childId) };
              }
              return c;
            })
          };
        }
        return { ...s, children: s.children.filter(c => c._id !== childId) };
      })
    }
  })),

  moveChild: (sectionId, index, direction, subSectionId) => set((state) => {
    const sections = state.page.sections.map(s => {
      if (s._id !== sectionId) return s;

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
            if (c._id === subSectionId && c.type === FieldType.SUB_SECTION) {
              return { ...c, children: move(c.children, index) };
            }
            return c;
          })
        };
      }
      return { ...s, children: move(s.children, index) };
    });
    return { page: { ...state.page, sections } };
  }),

  reorderChildren: (sectionId, startIndex, endIndex, subSectionId) => set((state) => {
    const sections = state.page.sections.map(s => {
      if (s._id !== sectionId) return s;

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
            if (c._id === subSectionId && c.type === FieldType.SUB_SECTION) {
              return { ...c, children: reorder(c.children) };
            }
            return c;
          })
        };
      }
      return { ...s, children: reorder(s.children) };
    });
    return { page: { ...state.page, sections } };
  }),

  resetPage: () => set({ page: getInitialPage() }),
}));