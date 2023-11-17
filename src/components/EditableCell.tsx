import { Form, Input, InputNumber } from 'antd';
import { EditableCellProps } from './type';

export const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  inputType,
  record,
  title,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
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
