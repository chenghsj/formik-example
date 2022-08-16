import React, { useState } from 'react';
import { Table, Dropdown, Menu } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { FormikProps } from 'formik';
import { IData, IInformation } from './reduxSlice/dataSlice';
import { InfoFormModal } from './InfoFormModal';

type Props = {
  setEnableReinitialize: (bool: boolean) => void;
  setSelectedRowValues: (values: IData) => void;
  selectedRow: IData;
} & FormikProps<IData>;

export default function InfoTable({
  errors,
  dirty,
  touched,
  values,
  setEnableReinitialize,
  handleSubmit,
  resetForm,
  setValues,
  setSelectedRowValues,
  selectedRow,
  ...props
}: Props) {
  const [infoFormModalVisible, setInfoFormModalVisible] = useState<boolean>(false);
  const [selectedInfoIdx, setSelectedInfoIdx] = useState<number>(-1);

  const actionMenu = (record: IInformation, index: number) => {
    const actionMenuItems = [
      { key: "edit", label: "Edit", onClick: handleEditClick(record, index) },
      { key: "delete", label: "Delete", onClick: handleDeleteClick(record) }
    ];
    return <Menu items={actionMenuItems} />;
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: 'name',
      render: (text: string, record: IInformation) => record.last_name + " " + record.first_name
    },
    { title: "Age", dataIndex: "age", key: 'age' },
    { title: "Email", dataIndex: "email", key: 'email' },
    {
      title: "Action",
      dataIndex: 'action',
      key: 'action',
      render: (text: string, record: IInformation, index: number) => {
        return <Dropdown overlay={actionMenu(record, index)} trigger={['click']} >
          <EllipsisOutlined style={{ border: "1px solid darkgray", padding: "3px 5px" }} />
        </Dropdown>;
      }
    }
  ];

  const handleEditClick = (record: IInformation, index: number) => () => {
    setSelectedInfoIdx(index);
    setInfoFormModalVisible(true);
  };

  const handleDeleteClick = (record: IInformation) => () => {
    const newInfoArr = (values as IData).information.filter(info => info.id !== record.id);
    const newValues = { ...values!, information: newInfoArr, newInfo: {} as IInformation } as IData;
    // delete newValues.newInfo;
    setValues(newValues);
    setSelectedRowValues(newValues);
    setEnableReinitialize(false);
  };

  const handleInfoFormCancel = () => {
    setInfoFormModalVisible(false);
    // setEnableReinitialize(true);
  };

  const handleInfoFormOk = () => {
    setInfoFormModalVisible(false);
    setEnableReinitialize(false);
  };

  return (
    <React.Fragment>
      <Table
        dataSource={(values as IData).information}
        rowKey={(record: IInformation) => record.id}
        columns={columns}
      />
      <InfoFormModal
        values={values}
        selectedInfoIdx={selectedInfoIdx}
        infoFormModalVisible={infoFormModalVisible}
        handleInfoFormOk={handleInfoFormOk}
        handleInfoFormCancel={handleInfoFormCancel}
        dirty={dirty}
        errors={errors}
        touched={touched}
      />
    </React.Fragment>
  );
}