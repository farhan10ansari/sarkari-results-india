export enum BlockType {
  KEY_VALUE = 'KEY_VALUE',
  TABLE = 'TABLE',
  MARKDOWN = 'MARKDOWN',
  LINK = 'LINK',
  DATE = 'DATE'
}

export interface TableRow {
  [columnKey: string]: string;
}

export interface TableData {
  columns: string[];
  rows: TableRow[];
}

export interface ContentBlock {
  id: string;
  type: BlockType;
  key?: string;
  value?: string;
  tableData?: TableData;
}

export interface SubSection {
  id: string;
  title: string;
  type: 'SUB_SECTION';
  children: ContentBlock[];
}

export type SectionChild = ContentBlock | SubSection;

export interface Section {
  id: string;
  title: string;
  type: 'SECTION';
  children: SectionChild[];
}


export type PageType = 'job' | 'result' | 'admission' | 'answer-key' | 'offline-form';

export interface PagePost {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  // lastDate?: string;
  sections: Section[];
  updatedAt: string;
  type: PageType;
  category?: string;
  importandDates?: {
    startDateOfApplication?: Date;
    lastDateOfApplication?: Date;
  }
}

export type PagePostDraft = Omit<PagePost, 'id' | 'updatedAt'>;