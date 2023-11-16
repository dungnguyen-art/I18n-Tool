import React from 'react';
import RenderTranslatedCell from './RenderTranslatedCell'; // Make sure to provide the correct path
import { MyData } from './type';

const Render: React.FC<{
  record: MyData;
  dataIndex: string;
  isEditing: (record: MyData) => boolean;
}> = ({ record, dataIndex, isEditing }) => {
  return (
    <RenderTranslatedCell record={record} dataIndex={dataIndex} isEditing={isEditing} />
  );
};
export default Render;
