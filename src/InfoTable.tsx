import React, { useEffect, useRef, useState } from 'react';
import { Table, Dropdown, Menu } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { Formik, FormikProps } from 'formik';
import { IData, IInformation } from './reduxSlice/dataSlice';
import { InfoFormModal } from './InfoFormModal';
import { validationSchema } from './validationSchema/validationSchema';
import EditInfoForm from './components/EditInfoForm';


type Props = {
} & FormikProps<IData>;

export default function InfoTable({
  errors,
  dirty,
  touched,
  values,
  handleSubmit,
  resetForm,
  setValues,
  ...props
}: Props) {
  const [selectedInfoIdx, setSelectedInfoIdx] = useState<number>(0);
  const editInfoRef = useRef<any>(null);
  const editInfoFormModalRef = useRef<any>(null);

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
    {title: "Income Source", dataIndex: "income_source", key: "income_source"},
    {title: "Job Title", dataIndex: "job_title", key: "job_title"},
    {title: "Company", dataIndex: "company", key: "company"},
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
    editInfoFormModalRef.current.setEditInfoFormModalVisible(true);
    setSelectedInfoIdx(index);
  };

  const handleDeleteClick = (record: IInformation) => () => {
    const newInfoArr = values.information.filter(info => info.id !== record.id);
    const newValues = { ...values!, information: newInfoArr };
    setValues(newValues);
  };

  return (
    <React.Fragment>
      <Table
        dataSource={(values as IData).information}
        rowKey={(record: IInformation) => record.id}
        columns={columns}
      />
      <EditInfoForm
        ref={editInfoFormModalRef}
        resetForm={resetForm}
        editInfoRef={editInfoRef}
        values={values}
        errors={errors}
        touched={touched}
        setValues={setValues}
        selectedInfoIdx={selectedInfoIdx}
        {...props} />
    </React.Fragment>
  );
}