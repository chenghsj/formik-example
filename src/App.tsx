import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, Select, Button, Row, Modal } from 'antd';
import { RootState } from './store';
import { Formik, Form, FormikProps } from 'formik';
import * as yup from 'yup';
import cloneDeep from 'lodash/cloneDeep';
import { addInfoAction, editNetAction, IData, IInformation, resetData } from './reduxSlice/infoSlice';
import * as uuid from 'uuid';
import './App.css';
import InfoTable from './InfoTable';
import NetFields from './formFields/NetFields';
import { useDispatch } from 'react-redux';
import InfoFields from './formFields/InfoFields';
import { InfoFormModal } from './InfoFormModal';

const validationInfoSchema = yup.object({
  age: yup.number().required("Required"),
  email: yup.string().email("Email must be a valid").required("Required"),
  first_name: yup.string().required("Required"),
  last_name: yup.string().required("Required"),
})

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
  const [selectedRow, setSelectedRow] = useState({} as IData)
  const [initialValues, setInitialValues] = useState({} as IData);
  const [addInfoInitialValues, setAddInfoInitialValues] = useState({} as IInformation)
  const [isInfoFormSubmit, setIsInfoFormSubmit] = useState(false);
  const [selectedRowChanged, setSelectedRowChanged] = useState(false);
  const [untouchedValues, setUntouchedValues] = useState({} as IData);
  const [init, setInit] = useState(false);
  const [addInfoFomModalVisible, setAddInfoFomModalVisible] = useState(false);
  const formikRef = useRef<any>(null)

  const handleAddInfoClick = () => {
    setAddInfoInitialValues({} as IInformation)
    setAddInfoFomModalVisible(true);
    setIsInfoFormSubmit(true);
    formikRef.current.setFieldValue("age", null);
    formikRef.current.setFieldValue("email", "");
    formikRef.current.setFieldValue("first_name", "");
    formikRef.current.setFieldValue("last_name", "");
  }

  const handleAddInfoFormOk = (values: IInformation) => () => {
    setAddInfoFomModalVisible(false);
    setAddInfoInitialValues(values);
    const newInfo: IInformation = {
      age: values.age,
      email: values.email,
      first_name: values.first_name,
      last_name: values.last_name,
      id: uuid.v4()
    }
    formikRef.current.setValues({ ...initialValues, information: initialValues.information.concat(newInfo) });
    setInitialValues({ ...initialValues, information: initialValues.information.concat(newInfo) })
    console.log(formikRef.current)
  }

  const handleAddInfoFormCancel = () => {
    setAddInfoFomModalVisible(false)
  }

  const handleSelectChange = (value: number) => {
    setSelectedRowNum(value);
  };

  const handleCancel = (setValues: (value: IData) => void) => () => {
    setValues(untouchedValues);
    setIsInfoFormSubmit(false);
    setInitialValues(untouchedValues);
  };

  useEffect(() => {
    setUntouchedValues(data.find(el => el.row === selectedRowNum)!);
  }, [init, selectedRowNum]);

  useEffect(() => {
    const selectedRow = data.find(el => el.row === selectedRowNum)!;
    setInitialValues(selectedRow);
    setInit(true);
    formikRef.current.setValues(selectedRow);
  }, [data, selectedRowNum]);

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
        enableReinitialize={!isInfoFormSubmit}
        initialValues={addInfoFomModalVisible ? addInfoInitialValues : initialValues}
        validationSchema={addInfoFomModalVisible ? validationInfoSchema : validationSchema}
        onSubmit={(values, actions) => {
          setIsInfoFormSubmit(false);
          alert(JSON.stringify(values, null, 2));
          dispatch(editNetAction({ rowId: initialValues.id, netData: values as IData }));
          setInit(false);
        }}
        component={(props: FormikProps<IData | IInformation>) => {
          const { dirty, errors, touched, handleSubmit, setValues, setFieldValue, values } = props;
          // console.log(values)
          return (
            <Form
              onSubmit={handleSubmit}
              style={{ margin: '0 auto', width: "500px" }}>
              <NetFields />
              <Row justify='end'>
                <Button onClick={handleAddInfoClick}>Add</Button>
              </Row>
              <InfoFormModal
                selectedInfoIdx={-1}
                infoFormModalVisible={addInfoFomModalVisible}
                handleInfoFormOk={handleAddInfoFormOk(values as IInformation)}
                handleInfoFormCancel={handleAddInfoFormCancel}
                {...props}
              />
              <InfoTable
                setIsInfoFormSubmit={setIsInfoFormSubmit}
                selectedRowNum={selectedRowNum}
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
                  disabled={!dirty || Object.keys(formikRef.current.errors).length > 0 || !touched}
                  htmlType="submit"
                >
                  Apply
                </Button>
              </Row>
            </Form>
          );
        }}
      >
      </Formik>
    </div >
  );
}

export default App;

