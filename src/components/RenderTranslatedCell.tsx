import React, { useState } from 'react';
import { Input, Form, Switch } from 'antd';
import { MyData, PropsDataRender, EditableCellProps, fields, LanguageData } from './type';
import { EditableCell } from './EditableCell';

interface RenderEditableCell {
  record: MyData;
  dataIndex: string | string[];
  inputType: string;
  isEditing: (record: MyData) => boolean;
  title: string;
}

// const renderEditableCell = ({
//   record,
//   dataIndex,
//   inputType,
//   isEditing,
//   title,
// }: RenderEditableCell) => {
//   return (
//     <EditableCell
//       editing={isEditing(record)}
//       dataIndex={dataIndex}
//       inputType={inputType}
//       record={record}
//       title={title}
//     />
//   );
// };

const RenderTranslatedCell = ({ record, dataIndex, isEditing }: PropsDataRender) => {
  let web, mobi, extension;
  switch (dataIndex) {
    case 'en':
      ({ web, mobi, extension } = record.en);
      break;
    case 'vi':
      ({ web, mobi, extension } = record.vi);
      break;
    case 'zh':
      ({ web, mobi, extension } = record.zh);
      break;
    case 'ja':
      ({ web, mobi, extension } = record.ja);
      break;
    case 'ru':
      ({ web, mobi, extension } = record.ru);
      break;
    default:
      break;
  }
  const allEqual = web === mobi && mobi === extension;
  const [singleInput, setSingleInput] = useState(allEqual);

  const toggleInputMode = () => {
    setSingleInput((prevMode) => !prevMode);
  };

  if (isEditing(record)) {
    return (
      <div>
        {singleInput ? (
          <div style={{ marginBottom: '10px' }}>
            <label>All</label>
            <EditableCell
              key="web"
              editing={isEditing(record)}
              dataIndex={[dataIndex, 'web']}
              inputType="text" // Set the correct inputType
              record={record}
              title="All"
            />
          </div>
        ) : (
          <div>
            {fields.map(({ name, label }) => (
              <div key={name} style={{ marginBottom: 8 }}>
                <label>{label}</label>
                <EditableCell
                  key={name}
                  editing={isEditing(record)}
                  dataIndex={[dataIndex, name]}
                  inputType="text" // Set the correct inputType
                  record={record}
                  title={label}
                />
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
          }}
        >
          <Switch
            size="small"
            style={{ marginLeft: '10px' }}
            checked={singleInput}
            onChange={toggleInputMode}
            checkedChildren="Single"
            unCheckedChildren="Separate"
          />
        </div>
      </div>
    );
  } else {
    if (allEqual) {
      return <span>{web}</span>;
    } else {
      return (
        <>
          <div style={{ color: 'red' }}>
            <span>Web: {web}</span>
          </div>
          <div style={{ color: 'blue' }}>
            <span>Mobi: {mobi}</span>
          </div>
          <div style={{ color: 'green' }}>
            <span>Extension: {extension}</span>
          </div>
        </>
      );
    }
  }
};

export default RenderTranslatedCell;
