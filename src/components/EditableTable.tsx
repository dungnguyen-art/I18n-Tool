import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Form, Popconfirm, Table, Typography, Input, Space, Button, Layout } from 'antd';
import { languages, MyData, LanguageData, fields } from './type';
import { EditableCell } from './EditableCell';
import Render from './Render';
import RenderTranslatedCell from './RenderTranslatedCell';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
const { Header, Footer } = Layout;

interface CustomColumnType<T> extends ColumnType<T> {
  editable?: boolean;
}

interface EditableTableProps {
  data: MyData[];
  setData: React.Dispatch<React.SetStateAction<MyData[]>>;
  isEditing: (record: MyData) => boolean;
  form: any; // Use the correct type for the form if possible
  editingKey: string;
  setEditingKey: React.Dispatch<React.SetStateAction<string>>;
  onSearchChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: () => void;
  save: (key: React.Key) => Promise<void>;
}

const EditableTable: React.FC<EditableTableProps> = ({
  data,
  setData,
  isEditing,
  form,
  editingKey,
  setEditingKey,
  onSearchChange,
  onSearchSubmit,
  save,
}) => {
  const [searchText, setSearchText] = useState<string>('');
  const [searchedColumn, setSearchedColumn] = useState<string>('');
  const searchInput = useRef<InputRef>(null);

  const [editedRows, setEditedRows] = useState([]);

  const handleSearch = (selectedKeys: any, confirm: any, dataIndex: string) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: any) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: keyof MyData): ColumnType<MyData> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) => {
      const nestedValue = record[dataIndex] as LanguageData;
      if (!nestedValue) {
        return false;
      }
      const { web = '', mobi = '', extension = '' } = nestedValue;
      const valuesToCheck = [web, mobi, extension];
      return valuesToCheck.some((nestedVal) => {
        if (typeof nestedVal === 'string') {
          return nestedVal.toLowerCase().includes(String(value).toLowerCase());
        } else if (typeof nestedVal === 'boolean') {
          return nestedVal === value;
        }
        return false; // or handle other types if needed
      });
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const edit = (record: Partial<MyData> & { key: React.Key }) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const columns: CustomColumnType<MyData>[] = [
    {
      title: 'Key',
      dataIndex: 'key',
      width: '14%',
      editable: false,
      ...getColumnSearchProps('key'),
    },
    ...languages.map((language) => ({
      title: language.title,
      dataIndex: language.dataIndex,
      width: '14%',

      ...getColumnSearchProps(language.dataIndex as keyof MyData),
      render: (_: any, record: MyData) => (
        <Render record={record} dataIndex={language.dataIndex} isEditing={isEditing} />
      ),
    })),
    {
      title: 'Operation',
      dataIndex: 'operation',
      render: (_: any, record: MyData) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Popconfirm
              title="Attention"
              description={
                <>
                  <p>
                    <strong>Single</strong> mode: Updates all three fields.
                  </p>
                  <p>
                    <strong>Separate</strong> mode: Updates each field individually.
                  </p>
                </>
              }
              onConfirm={() => {
                save(record.key);
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button style={{ marginRight: 8 }}>Save</Button>
            </Popconfirm>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: MyData) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header
          style={{
            textAlign: 'center',
            backgroundColor: 'purple',
            height: '50px',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ flex: '1', display: 'flex', alignItems: 'center' }}>
            I18N Tool - SubWallet
          </span>
          <div>
            <Input
              placeholder="Input your Token"
              style={{ marginLeft: 10, width: 200 }}
              onChange={onSearchChange}
              onPressEnter={onSearchSubmit}
            />
          </div>
        </Header>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            overflow: 'hidden',
          }}
        >
          <Form
            form={form}
            component={false}
            style={{ backgroundColor: '#f79e94', flex: 1, overflow: 'auto' }}
          >
            <Table
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              bordered
              dataSource={data}
              columns={mergedColumns as ColumnType<MyData>[]}
              rowClassName="editable-row"
              pagination={{
                onChange: cancel,
              }}
              scroll={{ y: 600 }}
              style={{ maxHeight: 'calc(100vh - 200px)', padding: '0 200px' }}
            />
          </Form>
        </div>
        <Footer
          style={{
            textAlign: 'center',
            backgroundColor: 'purple',
            color: 'white',
            height: '50px',
          }}
        >
          SubWallet ©2023 Created by SubWallet Team
        </Footer>
      </div>
    </>
  );
};

export default EditableTable;
