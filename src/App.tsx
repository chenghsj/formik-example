import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, Select, Button, Row, Modal } from 'antd';
import { RootState } from './store';
import { Formik, Form, FormikProps } from 'formik';
import * as yup from 'yup';
import cloneDeep from 'lodash/cloneDeep';
import { editNetAction, IData, IInformation, resetData } from './reduxSlice/infoSlice';
import './App.css';
import InfoTable from './InfoTable';
import NetFields from './formFields/NetFields';
import { useDispatch } from 'react-redux';

const validationSchema = yup.object({
  ip_address: yup.string().required("Required"),
  mac_address: yup.string().required("Required"),
  domain_name: yup.string().required("Required"),
  information: yup.array(yup.object({
    age: yup.number().required("Required"),
    email: yup.string().email("Email must be a valid").required("Required"),
    first_name: yup.string().required("Required"),
    last_name: yup.string().required("Required"),
  }))
});

function App() {
  const { data } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();
  const [selectedRowNum, setSelectedRowNum] = useState<number>(1);
  const [initialValues, setInitialValues] = useState<IData>({} as IData);
  const [isInfoFormSubmit, setIsInfoFormSubmit] = useState<boolean>(false);
  const [untouchedValues, setUntouchedValues] = useState<IData>({} as IData);
  const [init, setInit] = useState<boolean>(false);
  // let untouchedValues: IData = {} as IData;
  console.log(untouchedValues);

  const handleSelectChange = (value: number) => {
    setSelectedRowNum(value);
  };

  const handleCancel = (setValues: (value: IData) => void) => {
    setValues(untouchedValues);
    setIsInfoFormSubmit(false);
    dispatch(resetData({ rowId: initialValues.id, untouchedValues }));
  };

  useEffect(() => {
    console.log(untouchedValues);
    setUntouchedValues(data.find(el => el.row === selectedRowNum)!);
  }, [init, selectedRowNum]);

  useEffect(() => {
    const selectedRow = data.find(el => el.row === selectedRowNum)!;
    setInitialValues(selectedRow);
    setInit(true);
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
        enableReinitialize={!isInfoFormSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          alert(JSON.stringify(values, null, 2));
          setIsInfoFormSubmit(false);
          dispatch(editNetAction({ rowId: initialValues.id, netData: values }));
          setInit(false);
        }}
        component={(props: FormikProps<IData>) => {
          const { dirty, errors, touched, handleSubmit, setValues, setFieldValue } = props;
          // console.log(initialValues);
          // console.log(`dirty: ${dirty},\nerrors: ${Object.keys(errors).length > 0 ? true : false},\ntouched ${Object.keys(touched).length > 0 ? true : false}
          // `);
          return (
            <Form
              onSubmit={handleSubmit}
              style={{ margin: '0 auto', width: "500px" }}>
              <NetFields />
              <InfoTable
                setIsInfoFormSubmit={setIsInfoFormSubmit}
                selectedRowNum={selectedRowNum}
                {...props}
              />
              <Row>
                <Button
                  style={{ marginRight: "10px" }}
                  onClick={() => { handleCancel(setValues); }}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  disabled={!dirty || Object.keys(errors).length > 0 || !touched}
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
    </div>
  );
}

export default App;

