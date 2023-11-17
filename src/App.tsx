import React, { useEffect, useState } from 'react';
import './App.css';
import EditableTable from './components/EditableTable';
import { Form, Popconfirm, Table, Typography } from 'antd';
import { languages, MyData, LanguageData, StrapiData, LanguageDataPro } from './components/type';
// const token =
// "096ff9f4305ea99d58c85125d073c6cc09230dd234c5072b31d79743376444e2031db6c60ecf3ce9e7def98afae2fe5c1625bc14a5b7b7d8f1ca694c724604702584af4d9e6b75fead0bc2a5ab5253dbbebd3ce03ee82551c49e206df3000d9b1170d49741b3cbc5bbddb08143558494b48a668250f54fb02b0b20951ad0f2ea";
type RecordType = {
  data: LanguageDataPro;
};

function App() {
  const [form] = Form.useForm();
  const [data, setData] = useState<MyData[]>([]);
  const [editingKey, setEditingKey] = useState('');
  const [editedRows, setEditedRows] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [token, setToken] = useState('');

  const isEditing = (record: MyData) => record.key === editingKey;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };
  const handleSearchSubmit = () => {
    setToken(searchValue);
  };

  async function fetchAllRecords() {
    const recordsPerPage = 50;
    let allRecords: StrapiData[] = [];
    let currentPage = 0;

    while (true) {
      const response = await fetch(
        `http://localhost:1337/api/i18ns?populate=*&pagination[start]=${currentPage}&pagination[limit]=${recordsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status !== 200) {
        break;
      }

      const dataStrapi = await response.json();

      if (dataStrapi.data.length === 0) {
        break;
      }

      allRecords = allRecords.concat(dataStrapi.data);
      currentPage += recordsPerPage;
    }
    return allRecords;
  }
  useEffect(() => {
    const fetchDataFromStrapi = async () => {
      try {
        const dataStrapi = await fetchAllRecords();
        const mergedDataKeys = ['en', 'vi', 'zh', 'ja', 'ru'];
        const restructuredDataStrapi: MyData[] = dataStrapi.map((item) => {
          const key = item.attributes.key;
          const platform: MyData = {
            id: item.id,
            key,
            en: {},
            vi: {},
            zh: {},
            ja: {},
            ru: {},
          };
          mergedDataKeys.forEach((langKey) => {
            const langKeyProp = langKey as keyof typeof item.attributes;
            const x = item.attributes[langKeyProp];
            if (typeof x === 'object' && x !== null) {
              const languageData: LanguageData = {
                web: x.web || null,
                mobi: x.mobi || null,
                extension: x.extension || null,
              };
              (platform as any)[langKeyProp] = languageData;
            }
          });
          return {
            id: item.id,
            key,
            en: platform['en'] || { web: null, mobi: null, extension: null },
            vi: platform['vi'] || { web: null, mobi: null, extension: null },
            zh: platform['zh'] || { web: null, mobi: null, extension: null },
            ja: platform['ja'] || { web: null, mobi: null, extension: null },
            ru: platform['ru'] || { web: null, mobi: null, extension: null },
          };
        });
        setData(restructuredDataStrapi);

        console.log('restructuredDataStrapi', restructuredDataStrapi);
      } catch (error) {
        console.error('Error fetching data from Strapi:', error);
      }
    };
    fetchDataFromStrapi();
  }, [token]);

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as LanguageDataPro;
      for (const langCode in row) {
        if (langCode !== 'key') {
          const langData = row[langCode];
          if (langData && typeof langData === 'object') {
            const keys = Object.keys(langData);
            if (keys.length === 1) {
              const existingValue = langData[keys[0] as keyof typeof langData]!;
              langData.web = existingValue;
              langData.mobi = existingValue;
              langData.extension = existingValue;
            }
          }
          const previousData = data.find((item) => item.key === key);
          if (previousData) {
            row["id"] = previousData.id;
            row["key"] = previousData.key;
          }
          
        }
      }

      const putDataToStrapi = async (row: LanguageDataPro) => {
        try {
          const idx = row.id;
          delete row.id;
          const record: RecordType = {
            data: row,
          };
          record["data"] = row;
          console.log("record", record);
          const response = await fetch(
            `http://localhost:1337/api/i18ns/${idx}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(record),
            }
          );

          if (response.ok) {
            console.log(`Data with ID ${idx} updated in Strapi`);
          } else {
            console.error(`Failed to update data with ID ${idx} in Strapi`);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };
      putDataToStrapi(row);
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row as any);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  return (
    <div className="App">
      <EditableTable
        data={data}
        setData={setData}
        isEditing={isEditing}
        editingKey={editingKey}
        setEditingKey={setEditingKey}
        form={form}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        save={save}
      />
    </div>
  );
}
export default App;
