import React, { useEffect, useState } from 'react';
import './App.css';
import EditableTable from './components/EditableTable';
import { Form, Popconfirm, Table, Typography } from 'antd';
import { languages, MyData, LanguageData } from './components/type';

function App() {
  const [form] = Form.useForm();
  const [data, setData] = useState<MyData[]>([]);
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record: MyData) => record.key === editingKey;
  useEffect(() => {
    const originData: MyData[] = [];
    for (let i = 0; i < 100; i++) {
      const fakeData: MyData = {
        key: "common.key",
        en: {
          web: 'ahahahhha',
          mobi: 'ahahahhha',
          extension: 'ahahahhha',
        },
        vi: {
          web: 'ahahahhha',
          mobi: 'ahahahhha',
          extension: 'ahahahhha',
        },
        zh: {
          web: 'ahahahhha',
          mobi: 'ahahahhha',
          extension: 'ahahahhha',
        },
        ja: {
          web: 'ahahahhha',
          mobi: 'ahahahhha',
          extension: 'ahahahhha',
        },
        ru: {
          web: 'ahahahhha',
          mobi: 'ahahahhha',
          extension: 'ahahahhha',
        },
      };
      originData.push(fakeData);
    }
    setData(originData);
  }, []);

  return (
    <div className="App">
      <EditableTable
        data={data}
        setData={setData}
        isEditing={isEditing}
        editingKey={editingKey}
        setEditingKey={setEditingKey}
        form={form}
      />
    </div>
  );
}

export default App;
