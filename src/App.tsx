import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, Select, Button, Row, Modal } from 'antd';
import { RootState } from './store';
import { Formik, Form, FormikProps } from 'formik';
import * as yup from 'yup';
import cloneDeep from 'lodash/cloneDeep';
import { updateRowDataAction, IData, IInformation } from './reduxSlice/infoSlice';
import * as uuid from 'uuid';
import './App.css';
import InfoTable from './InfoTable';
import NetFields from './formFields/NetFields';
import { useDispatch } from 'react-redux';
import { InfoFormModal } from './InfoFormModal';

const validationInfoSchema = yup.object({
  age: yup.number().required("Required"),
  email: yup.string().email("Email must be a valid").required("Required"),
  first_name: yup.string().required("Required"),
  last_name: yup.string().required("Required"),
});

const validationSchema = yup.object({
  ip_address: yup.string().required("Required"),
  mac_address: yup.string().required("Required"),
  domain_name: yup.string().required("Required"),
  information: yup.array(validationInfoSchema)
});

function App() {
  const { data } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();
  const [selectedRowNum, setSelectedRowNum] = useState(1);
  const [selectedRowValues, setSelectedRowValues] = useState({} as IData);
  const [addInfoInitialValues, setAddInfoInitialValues] = useState({} as IInformation);
  const [enableReinitialize, setEnableReinitialize] = useState(true);
  const [untouchedValues, setUntouchedValues] = useState({} as IData);
  const [untouchedValuesFlag, setUntouchedValuesFlag] = useState(false);
  const [addInfoFomModalVisible, setAddInfoFomModalVisible] = useState(false);
  const formikRef = useRef<any>(null);

  const handleAddInfoClick = () => {
    setAddInfoInitialValues({} as IInformation);
    setAddInfoFomModalVisible(true);
    setEnableReinitialize(false);
    formikRef.current.setFieldValue("age", null);
    formikRef.current.setFieldValue("email", "");
    formikRef.current.setFieldValue("first_name", "");
    formikRef.current.setFieldValue("last_name", "");
  };

  const handleAddInfoFormOk = (values: IInformation, setErrors: (values: any) => void) => () => {
    setAddInfoFomModalVisible(false);
    setAddInfoInitialValues(values);
    const newInfo: IInformation = {
      age: values.age,
      email: values.email,
      first_name: values.first_name,
      last_name: values.last_name,
      id: uuid.v4()
    };
    formikRef.current.setValues({ ...formikRef.current.values, information: selectedRowValues.information.concat(newInfo) });
    setSelectedRowValues({ ...formikRef.current.values, information: selectedRowValues.information.concat(newInfo) });
    setErrors({});
  };

  const handleAddInfoFormCancel = (setErrors: (values: any) => void) => () => {
    setAddInfoFomModalVisible(false);
    formikRef.current.setErrors({});
    setErrors({});
  };

  const handleSelectChange = (value: number) => {
    setSelectedRowNum(value);
    setUntouchedValuesFlag(false);
    formikRef.current.setTouched({});
    setEnableReinitialize(true);
  };

  const handleCancel = (setValues: (value: IData) => void) => () => {
    setValues(untouchedValues);
    setEnableReinitialize(true);
    setSelectedRowValues(untouchedValues);
  };

  useEffect(() => {
    const rowData = data.find(el => el.row === selectedRowNum)!;
    setSelectedRowValues(rowData);
    setUntouchedValuesFlag(true);
    formikRef.current.setValues(rowData);
    formikRef.current.resetForm(rowData);
  }, [data, selectedRowNum]);

  useEffect(() => {
    const rowData = data.find(el => el.row === selectedRowNum)!;
    setUntouchedValues(rowData!);
  }, [untouchedValuesFlag, selectedRowNum]);

  return (
    <div className="App">
      <Row style={{ width: "100%" }} align="middle" justify="space-between">
        <Select
          style={{ width: "100px", margin: "20px 0" }}
          defaultValue={1}
          onChange={handleSelectChange}>
          {data.map(item => (
            <Select.Option key={item.id} value={item.row}>{item.row}</Select.Option>
          ))}
        </Select>
      </Row>
      <Formik
        innerRef={formikRef}
        enableReinitialize={enableReinitialize}
        initialValues={addInfoFomModalVisible ? addInfoInitialValues : selectedRowValues}
        validationSchema={addInfoFomModalVisible ? validationInfoSchema : validationSchema}
        onSubmit={(values) => {
          setEnableReinitialize(true);
          alert(JSON.stringify(values, null, 2));
          dispatch(updateRowDataAction({ rowId: selectedRowValues.id, rowData: values as IData }));
          setUntouchedValuesFlag(false);
        }}
        component={(props: FormikProps<IData | IInformation>) => {
          const { dirty, touched, handleSubmit, setValues, setErrors, values, errors } = props;
          return (
            <>
              <Form
                onSubmit={handleSubmit}
                style={{ margin: '0 auto', width: "500px" }}>
                <NetFields />
                <Row justify='end'>
                  <Button
                    onClick={handleAddInfoClick}
                  >
                    Add
                  </Button>
                </Row>
                <InfoFormModal
                  selectedInfoIdx={-1}
                  infoFormModalVisible={addInfoFomModalVisible}
                  handleInfoFormOk={handleAddInfoFormOk(values as IInformation, setErrors)}
                  handleInfoFormCancel={handleAddInfoFormCancel(setErrors)}
                  {...props}
                />
                <InfoTable
                  selectedRow={selectedRowValues}
                  setSelectedRowValues={setSelectedRowValues}
                  setEnableReinitialize={setEnableReinitialize}
                  {...props}
                />
                <Row>
                  <Button
                    style={{ marginRight: "10px" }}
                    onClick={handleCancel(setValues)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    disabled={!dirty
                      || (Object.keys(formikRef.current?.errors).length > 0 && Object.keys(errors).length > 0)
                      || !touched}
                    htmlType="submit"
                  >
                    Apply
                  </Button>
                </Row>
              </Form>
            </>

          );
        }}
      >
      </Formik>
    </div >
  );
}

export default App;

