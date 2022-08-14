import React, { useEffect, useState, useRef } from 'react';
import { Table, Dropdown, Menu, Modal, Button, Row, Col } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { Formik, useFormik, Field, Form, FormikProps } from 'formik';
import * as yup from 'yup';
import { AntInput, AntInputNumber } from "./CreateAntFields";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { deleteInfoAction, editInfoAction, IInformation } from './reduxSlice/infoSlice';
import InfoFields from './formFields/InfoFields';

type Props = {
  // selectedRow: IData;
  selectedRowNum: number;
};

const validateInfoFormSchema = yup.object({
  age: yup.number().required("Required"),
  email: yup.string().email().required("Required"),
  first_name: yup.string().required("Required"),
  last_name: yup.string().required("Required"),
});

export default function InfoTable({ selectedRowNum }: Props) {
  const { data } = useSelector((state: RootState) => state);
  const selectedRow = data.find(el => el.row === selectedRowNum);
  const dispatch = useDispatch();
  const [infoFormModal, setInfoFormModal] = useState<boolean>(false);
  const [initialInfoFormValues, setInitialInfoFormValues] = useState<IInformation>({} as IInformation);
  const formikRef = useRef<FormikProps<IInformation>>(null);

  const actionMenu = (record: IInformation) => {
    const actionMenuItems = [
      { key: "edit", label: "Edit", onClick: () => handleEditClick(record) },
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
      render: (text: string, record: IInformation) => {
        return <Dropdown overlay={actionMenu(record)} trigger={['click']} >
          <EllipsisOutlined style={{ border: "1px solid darkgray", padding: "3px 5px" }} />
        </Dropdown>;
      }
    }
  ];

  const handleEditClick = (record: IInformation) => {
    setInfoFormModal(true);
    setInitialInfoFormValues(record);
  };

  const handleDeleteClick = (record: IInformation) => {
    dispatch(deleteInfoAction({ rowId: selectedRow!.id, infoId: record.id }));
  };

  const handleInfoFormCancel = () => {
    setInfoFormModal(false);
    formikRef.current?.resetForm();
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
        footer={null}
        onCancel={handleInfoFormCancel}
      >
        <Formik
          innerRef={formikRef}
          enableReinitialize
          initialValues={initialInfoFormValues}
          validationSchema={validateInfoFormSchema}
          onSubmit={values => {
            setInfoFormModal(false);
            alert(JSON.stringify(values, null, 2));
            // formikRef.current?.resetForm();
            dispatch(editInfoAction({ rowId: selectedRow!.id, infoId: values.id, info: values }));
          }}
          component={(props: FormikProps<IInformation>) => {
            const { dirty, errors, touched, handleSubmit } = props;
            return (
              <Form
                onSubmit={handleSubmit}
              >
                <InfoFields />
                <Row justify='end'>
                  <Button onClick={handleInfoFormCancel} style={{ marginRight: '20px' }}>Cancel</Button>
                  <Button
                    disabled={!dirty || Object.keys(errors).length > 0 || !touched}
                    htmlType="submit"
                    type='primary'
                  >
                    Submit
                  </Button>
                </Row>
              </Form>);
          }}
        />
      </Modal>
    </>

  );
}