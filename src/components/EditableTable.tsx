import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Form, Popconfirm, Table, Typography, Input, Space, Button } from 'antd';
import { languages, MyData, LanguageData, fields } from './type';
import { EditableCell } from './EditableCell';
import Render from './Render';
import RenderTranslatedCell from './RenderTranslatedCell';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';

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
}

const EditableTable: React.FC<EditableTableProps> = ({
  data,
  setData,
  isEditing,
  form,
  editingKey,
  setEditingKey,
}) => {
  const [searchText, setSearchText] = useState<string>('');
  const [searchedColumn, setSearchedColumn] = useState<string>('');
  const searchInput = useRef<InputRef>(null);

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
    form.setFieldsValue({ name: '', age: '', address: '', ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as MyData;
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
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns: CustomColumnType<MyData>[] = [
    {
      title: 'Key',
      dataIndex: 'key',
      width: '14%',
      editable: true,
      ...getColumnSearchProps('key'),
    },
    ...languages.map((language) => ({
      title: language.title,
      dataIndex: language.dataIndex,
      width: '14%',
      editable: false,
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
            <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              Save
            </Typography.Link>
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
        inputType: col.dataIndex === 'key' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
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
      />
    </Form>
  );
};

export default EditableTable;
