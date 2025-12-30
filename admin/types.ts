export enum BlockType {
  KEY_VALUE = 'KEY_VALUE',
  TABLE = 'TABLE',
  MARKDOWN = 'MARKDOWN',
  LINKS = 'LINKS',
  DATES = 'DATES'
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

export interface JobPost {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  lastDate?: string;
  sections: Section[];
  updatedAt: string;
}

export type JobPostDraft = Omit<JobPost, 'id' | 'updatedAt'>;