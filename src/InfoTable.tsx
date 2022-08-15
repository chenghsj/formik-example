import React, { useEffect, useLayoutEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Table, Dropdown, Menu, Modal } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { deleteInfoAction, editInfoAction, IData, IInformation } from './reduxSlice/infoSlice';
import InfoFields from './formFields/InfoFields';
import { InfoFormModal } from './InfoFormModal';

type Props = {
  selectedRowNum: number;
  setIsInfoFormSubmit: (bool: boolean) => void;
} & FormikProps<IData | IInformation>;

export default function InfoTable({
  selectedRowNum,
  errors,
  dirty,
  touched,
  values,
  setIsInfoFormSubmit,
  handleSubmit,
  resetForm,
  setValues,
  initialValues,
  ...props
}: Props) {
  const { data } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();
  const selectedRow = data.find(el => el.row === selectedRowNum);
  const [infoFormModalVisible, setInfoFormModalVisible] = useState<boolean>(false);
  const [selectedInfoIdx, setSelectedInfoIdx] = useState<number>(-1);
  const [selectedInfoId, setSelectedInfoId] = useState<string>("");

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
    setSelectedInfoId(record.id);
    setSelectedInfoIdx(index);
    setInfoFormModalVisible(true);
  };

  const handleDeleteClick = (record: IInformation) => () => {
    // dispatch(deleteInfoAction({ rowId: selectedRow!.id, infoId: record.id }));
    const newInfoArr = (values as IData).information.filter(info => info.id !== record.id)
    setValues({...values!, information: newInfoArr})
  };

  const handleInfoFormCancel = () => {
    setInfoFormModalVisible(false);
    setIsInfoFormSubmit(false);
    resetForm();
  };

  const handleInfoFormOk = () => {
    setInfoFormModalVisible(false);
    setIsInfoFormSubmit(true);
    // dispatch(editInfoAction({
    //   rowId: selectedRow!.id,
    //   infoId: selectedInfoId,
    //   info: (values as IData).information[selectedInfoIdx]
    // }));
  };

  return (
    <React.Fragment>
      <Table
        dataSource={(values as IData).information}
        rowKey={(record: IInformation) => record.id}
        columns={columns}
      />
      <InfoFormModal
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