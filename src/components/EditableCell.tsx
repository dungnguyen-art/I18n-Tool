import { Form, Input, InputNumber } from 'antd';
import { EditableCellProps } from './type';

export const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  inputType,
  record,
  title,
  children,
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={
            [
              // {
              //   required: true,
              //   message: `Please Input ${title}!`,
              // },
            ]
          }
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
