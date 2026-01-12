export enum PageType {
    JOB = 'job',
    RESULT = 'result',
    ADMISSION = 'admission',
    ANSWER_KEY = 'answer_key',
    OFFLINE_FORM = 'offline_form',
}

export enum FieldType {
    KEY_VALUE = 'KEY_VALUE',
    TABLE = 'TABLE',
    MARKDOWN = 'MARKDOWN',
    LINK = 'LINK',
    DATE = 'DATE',
    SUB_SECTION = 'SUB_SECTION',
}

export enum SectionType {
    SECTION = 'SECTION',
}

export enum PageStatus {
    DRAFT = 'DRAFT',
    ARCHIVED = 'ARCHIVED',
    PUBLISHED = 'PUBLISHED',
    TRASHED = 'TRASHED',
}

export interface ITableData {
    columns: string[];
    rows: Record<string, string>[];
}

export interface IBaseField {
    _id: string;
    type: FieldType;
}

export interface IKeyValueField extends IBaseField {
    type: FieldType.KEY_VALUE;
    key: string;
    value: string;
}

export interface ITableField extends IBaseField {
    type: FieldType.TABLE;
    tableData: ITableData;
}

export interface IMarkdownField extends IBaseField {
    type: FieldType.MARKDOWN;
    value: string;
}

export interface ILinkField extends IBaseField {
    type: FieldType.LINK;
    key: string;
    value: string;
}

export interface IDateField extends IBaseField {
    type: FieldType.DATE;
    key: string;
    value: string;
}

export interface ISubSectionField extends IBaseField {
    type: FieldType.SUB_SECTION;
    title: string;
    children: IFieldWithoutSubSection[];
}

export type IFieldWithoutSubSection =
    | IKeyValueField
    | ITableField
    | IMarkdownField
    | ILinkField
    | IDateField;

export type IField =
    | IKeyValueField
    | ITableField
    | IMarkdownField
    | ILinkField
    | IDateField
    | ISubSectionField;

export interface ISection {
    _id: string;
    title: string;
    type: SectionType;
    children: IField[];
}


export interface IDisplayConfig {
    // for future use
}

export interface IMetadata {
    // for future use
}

export interface IPage {
    schemaVersion?: number; // Schema Version of the Page
    _id: string; // ID of the Page
    title: string; // Title of the Page
    slug: string; // URL of the Page
    description: string; // Description of the Page
    publishedAt?: string; //Iso String of Published Date of the Page
    updatedAt?: string; //Iso String of Last Updated Date of the Page
    type: PageType; // Type of the Page Like Job, Result, Admission, Answer Key, Offline Form
    status?: PageStatus; // Status of the Page Like Draft, Published, Archived, Trashed
    displayConfig?: IDisplayConfig; // Display Configuration of the Page
    metadata?: IMetadata; // Metadata of the Page

    category?: string; // Category of the Page
    importantDates?: {
        startDateOfApplication?: string;
        lastDateOfApplication?: string;
    };

    sections: ISection[]; // Sections of the Page
}


export type IPageWithoutId = Omit<IPage, '_id'>;