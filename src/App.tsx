import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Select, Button, Row } from 'antd';
import { Formik, Form, FormikProps, FormikHelpers } from 'formik';
import { useDispatch } from 'react-redux';

import { RootState } from './store';
import { updateRowDataAction, IData, IInformation } from './reduxSlice/dataSlice';
import './App.css';
import InfoTable from './components/InfoTable';
import NetFields from './components/formFields/NetFields';
import AddInfoForm, { trimObj } from './components/AddInfoForm';
import { validationSchema } from './validationSchema/validationSchema';



function App() {
  const { data } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();
  const [selectedRowNum, setSelectedRowNum] = useState(1);
  const [initialValues, setInitialValues] = useState({} as IData);
  const formikRef = useRef<FormikProps<IData>>(null);
  const addInfoRef = useRef<FormikProps<IInformation>>(null);
  const addInfoModalRef = useRef<any>(null)

  const handleAddInfoBtnClick = () => {
    addInfoModalRef.current.setAddInfoFomModalVisible(true);
    addInfoRef.current!.resetForm();
  };

  const handleSelectChange = (value: number) => {
    setSelectedRowNum(value);
  };

  const handleCancel = (setValues: (value: IData) => void) => () => {
    setValues(formikRef.current!.initialValues);
    setInitialValues(formikRef.current!.initialValues);
  };

  const handleSubmit = (values: IData, action: FormikHelpers<IData>) => {
    alert(JSON.stringify(values, null, 2));
    dispatch(updateRowDataAction({ rowId: initialValues.id, rowData: trimObj(values) as IData }));
    action.resetForm();
  };

  useLayoutEffect(() => {
    const rowData = data.find(el => el.row === selectedRowNum)!;
    formikRef.current!.setValues({ ...rowData })
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
                  formikRef={formikRef}
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
      <AddInfoForm
        ref={addInfoModalRef}
        formikRef={formikRef}
        addInfoRef={addInfoRef}
      />
    </div >
  );
}

export default App;

