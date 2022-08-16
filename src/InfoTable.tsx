import React, { useEffect, useRef, useState } from 'react';
import { Table, Dropdown, Menu } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { Formik, FormikProps } from 'formik';
import { IData, IInformation } from './reduxSlice/dataSlice';
import { InfoFormModal } from './InfoFormModal';
import { validationSchema } from './validationSchema/validationSchema';


type Props = {
  setEnableReinitialize: (bool: boolean) => void;
} & FormikProps<IData>;

export default function InfoTable({
  errors,
  dirty,
  touched,
  values,
  handleSubmit,
  resetForm,
  setValues,
  setEnableReinitialize,
  ...props
}: Props) {
  const [infoFormModalVisible, setInfoFormModalVisible] = useState<boolean>(false);
  const [selectedInfoIdx, setSelectedInfoIdx] = useState<number>(0);
  const editInfoRef = useRef<any>(null);
  console.log(values);
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
    console.log('clicked');
    setInfoFormModalVisible(true);
    setEnableReinitialize(false);
    setSelectedInfoIdx(index);
  };

  const handleDeleteClick = (record: IInformation) => () => {
    const newInfoArr = values.information.filter(info => info.id !== record.id);
    const newValues = { ...values!, information: newInfoArr };
    setValues(newValues);
  };

  const handleInfoFormCancel = () => {
    setInfoFormModalVisible(false);
    editInfoRef.current.setValues(values);
  };

  const handleInfoFormOk = () => {
    setInfoFormModalVisible(false);
    setValues(editInfoRef.current.values);
  };

  return (
    <React.Fragment>
      <Table
        dataSource={(values as IData).information}
        rowKey={(record: IInformation) => record.id}
        columns={columns}
      />
      <Formik
        innerRef={editInfoRef}
        enableReinitialize
        initialValues={values}
        validationSchema={validationSchema.pick(['information'])}
        onSubmit={() => { }}
        component={(props: FormikProps<IData>) => {
          return (
            <InfoFormModal
              selectedInfoIdx={selectedInfoIdx}
              infoFormModalVisible={infoFormModalVisible}
              handleInfoFormOk={handleInfoFormOk}
              handleInfoFormCancel={handleInfoFormCancel}
              {...props}
            />
          );
        }}
      />

    </React.Fragment>
  );
}