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
