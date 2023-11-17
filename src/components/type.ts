export interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string | string[];
  inputType: string;
  record: MyData;
}


export const languages = [
  { title: 'English', dataIndex: 'en' },
  { title: 'Vietnamese', dataIndex: 'vi' },
  { title: 'Chinese', dataIndex: 'zh' },
  { title: 'Japanese', dataIndex: 'ja' },
  { title: 'Russian', dataIndex: 'ru' },
];
export interface LanguageData {
  web?: string | null;
  mobi?: string | null;
  extension?: string | null;
}

export type MyData = {
  id: string;
  key : string;
  en : LanguageData;
  vi : LanguageData;
  zh : LanguageData;
  ja : LanguageData;
  ru : LanguageData;
}

export type MyDataStrapi = {
  id: string;
  myData: MyData;
};

export interface StrapiData {
  attributes:  MyData;
  id: string
}


export interface LanguageDataPro {
  [key: string]: LanguageData | string | null | undefined;
}

export interface PropsDataRender {
  record: MyData;
  dataIndex: string;
  isEditing: (record: MyData) => boolean;
}

export const fields = [
  { name: 'web', label: 'Web' },
  { name: 'mobi', label: 'Mobi' },
  { name: 'extension', label: 'Extension' },
];
