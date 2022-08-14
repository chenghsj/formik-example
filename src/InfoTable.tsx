import React, { useEffect, useState, } from 'react';
import { Table, Dropdown, Menu, Modal } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { deleteInfoAction, editInfoAction, IData, IInformation } from './reduxSlice/infoSlice';
import InfoFields from './formFields/InfoFields';

type Props = {
  selectedRowNum: number;
  setIsInfoFormSubmit: (bool: boolean) => void;
} & FormikProps<IData>;

export default function InfoTable({
  selectedRowNum,
  errors,
  dirty,
  touched,
  values,
  setIsInfoFormSubmit,
  handleSubmit,
  ...pops
}: Props) {
  const { data } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();
  const selectedRow = data.find(el => el.row === selectedRowNum);
  const [infoFormModal, setInfoFormModal] = useState<boolean>(false);
  // const [initialInfoFormValues, setInitialInfoFormValues] = useState<IInformation>({} as IInformation);
  const [selectedInfoIdx, setSelectedInfoIdx] = useState<number>(-1);
  const [selectedInfoId, setSelectedInfoId] = useState<string>("");

  const actionMenu = (record: IInformation, index: number) => {
    const actionMenuItems = [
      { key: "edit", label: "Edit", onClick: () => handleEditClick(record, index) },
      { key: "delete", label: "Delete", onClick: () => handleDeleteClick(record) }
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

  const handleEditClick = (record: IInformation, index: number) => {
    setSelectedInfoId(record.id);
    setSelectedInfoIdx(index);
    setInfoFormModal(true);
  };

  const handleDeleteClick = (record: IInformation) => {
    dispatch(deleteInfoAction({ rowId: selectedRow!.id, infoId: record.id }));
  };

  const handleInfoFormCancel = () => {
    setInfoFormModal(false);
    setIsInfoFormSubmit(false);
  };

  const handleInfoFormOk = () => {
    setInfoFormModal(false);
    setIsInfoFormSubmit(true);
    dispatch(editInfoAction({ rowId: selectedRow!.id, infoId: selectedInfoId, info: values.information[selectedInfoIdx] }));
  };

  return (
    <>
      <Table
        dataSource={selectedRow?.information}
        rowKey={(record: IInformation) => record.id}
        columns={columns}
      />
      <Modal
        title="Information"
        visible={infoFormModal}
        okButtonProps={{
          disabled: !dirty || Object.keys(errors).length > 0 || !touched
        }}
        onOk={handleInfoFormOk}
        onCancel={handleInfoFormCancel}
      >
        <InfoFields selectedInfoIdx={selectedInfoIdx} />
      </Modal>
    </>

  );
}