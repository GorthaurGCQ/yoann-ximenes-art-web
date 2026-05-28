export type ContentKind = 'text' | 'richtext' | 'image';

export interface ContentEntry {
  key: string;
  kind: ContentKind;
  value: string;
  updatedAt: string;
  updatedBy: string;
}

export interface ChangeLog {
  id: string;
  key: string;
  oldValue: string;
  newValue: string;
  updatedAt: string;
  updatedBy: string;
}

export interface CmsStore {
  entries: Record<string, ContentEntry>;
  logs: ChangeLog[];
}
