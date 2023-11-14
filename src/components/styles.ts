export interface Item {
  key: string;
  name: string;
  age: number;
  address: string;
}

export interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: Item;
  index: number;
  children: React.ReactNode;
}

export const languages = [
  { title: 'English', dataIndex: 'en' },
  { title: 'Vietnamese', dataIndex: 'vi' },
  { title: 'Chinese', dataIndex: 'zh' },
  { title: 'Japanese', dataIndex: 'ja' },
  { title: 'Russian', dataIndex: 'ru' },
];
export interface LanguageData {
  web: string | null;
  mobi: string | null;
  extension: string | null;
}

export interface MyData {
  key: string;
  en: LanguageData;
  vi: LanguageData;
  zh: LanguageData;
  ja: LanguageData;
  ru: LanguageData;
}
