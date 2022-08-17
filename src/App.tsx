import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Select, Button, Row } from 'antd';
import { RootState } from './store';
import { Formik, Form, FormikProps, FormikState } from 'formik';
import * as yup from 'yup';
import { updateRowDataAction, IData, IInformation } from './reduxSlice/dataSlice';
import './App.css';
import InfoTable from './InfoTable';
import NetFields from './formFields/NetFields';
import { useDispatch } from 'react-redux';
import NewInfoForm from './components/NewInfoForm';
import { validationSchema } from './validationSchema/validationSchema';

function App() {
  const { data } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();
  const [selectedRowNum, setSelectedRowNum] = useState(1);
  const [initialValues, setInitialValues] = useState({} as IData);
  const formikRef = useRef<any>(null);
  const newInfoRef = useRef<any>(null);
  const addInfoModalRef = useRef<any>(null)

  const handleAddInfoBtnClick = () => {
    addInfoModalRef.current.setAddInfoFomModalVisible(true);
    newInfoRef.current.resetForm();
  };

  const handleSelectChange = (value: number) => {
    setSelectedRowNum(value);
  };

  const handleCancel = (setValues: (value: IData) => void) => () => {
    setValues(formikRef.current.initialValues);
    setInitialValues(formikRef.current.initialValues);
  };

  const handleSubmit = (values: IData) => {
    alert(JSON.stringify(values, null, 2));
    dispatch(updateRowDataAction({ rowId: initialValues.id, rowData: values as IData }));
  };

  useEffect(() => {
    const rowData = data.find(el => el.row === selectedRowNum)!;
    setInitialValues({ ...rowData });
  }, [data, selectedRowNum]);


  return (
    <div className="App">
      <Row style={{ width: "100%" }} align="middle" justify="space-between">
        <Select
          style={{ width: "100px", margin: "20px 0" }}
          defaultValue={1}
          onChange={handleSelectChange}>
          {data.map(item => (
            <Select.Option
              key={item.id}
              value={item.row}>
              {item.row}
            </Select.Option>
          ))}
        </Select>
      </Row>
      <Formik
        innerRef={formikRef}
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        component={(props: FormikProps<IData>) => {
          const { dirty, handleSubmit, setValues, errors } = props;
          const disableSubmitBtn = !dirty || Object.keys(errors).length > 0;

          return (
            <>
              <Form
                onSubmit={handleSubmit}
                style={{ margin: '0 auto', width: "50vw" }}>
                <NetFields />
                <Row justify='end'>
                  <Button onClick={handleAddInfoBtnClick}>
                    Add
                  </Button>
                </Row>
                <InfoTable
                  {...props}
                />
                <Row>
                  <Button
                    disabled={!dirty}
                    style={{ marginRight: "10px" }}
                    onClick={handleCancel(setValues)}
                  >
                    Reset
                  </Button>
                  <Button
                    type="primary"
                    disabled={disableSubmitBtn}
                    htmlType="submit"
                  >
                    Submit
                  </Button>
                </Row>
              </Form>
            </>
          );
        }}
      >
      </Formik>
      <NewInfoForm
        ref={addInfoModalRef}
        formikRef={formikRef}
        newInfoRef={newInfoRef}
      />
    </div >
  );
}

export default App;

